import React, { useEffect, useState, useCallback } from 'react';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _merge from 'lodash/merge';
import getConfig from 'next/config';
import axios from 'axios';
import {
  Row, Col, Icon, Tooltip, Divider,
  Form, Input, Button, Select,
} from 'antd';
import { useRouter } from 'next/router';
import styles from './style.scss';
import { getMapCategories, translateCategory } from '../src/utils/populate';
import TourCard from '../src/components/TourCard';
import TourDetailPage from './tour';
import DetailsEditor from '../src/components/DetailsEditor';
import FormSwitcher from '../src/components/HikeComposer/FormSwitcher';
import ExportModal from '../src/components/HikeComposer/ExportModal';
import EditHike from '../src/components/HikeComposer/EditHike';
import PreviewSwitcher from '../src/components/HikeComposer/PreviewSwitcher';
import i18next, { locales, defaultLocale } from '../i18n';

const { publicRuntimeConfig } = getConfig();

const { TextArea } = Input;
const { Option } = Select;

const BASE_API = 'http://localhost:3200/api';

const localizedFields = ['title', 'description', 'details'];
const getDefaultLocalizationObj = () => locales.reduce((previous, locale) => ({
  ...previous,
  [locale]: {},
}), {});
const getNewTourTemplate = ({ checksum, kuid, zipName }) => {
  const timestamp = Math.floor(Date.now() / 1000);
  return {
    nid: timestamp,
    created: timestamp,
    updated: timestamp,
    hikeVersion: '1.0',
    title: '',
    description: '',
    checksum,
    kuid,
    category: [],
    details: '',
    cards: 1,
    tourLink: zipName,
    time: 1,
    platformVersion: 9.2,
    localization: getDefaultLocalizationObj(),
  };
};

const GenerateTourPage = () => {
  const { query } = useRouter();
  const { checksum, kuid, zipName } = query;
  const [values, setValues] = useState(getNewTourTemplate({ checksum, kuid, zipName }));

  const [isCKEditorVisible, setIsCKEditorVisible] = useState(false);
  const [view, setView] = useState('card');
  const [selectedFile/* , setSelectedFile */] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  const [previewMode, setPreviewMode] = useState('split');
  const [visible, setVisible] = useState(false);
  const [exportJsonData, setexportJsonData] = useState({});

  const [categories, setCategories] = useState([]);

  // Form Switcher states
  const [current, setCurrent] = useState('new');

  // Editing Language switch
  const [editingLanguage, setEditingLanguage] = useState(defaultLocale);

  const handleSwitcherClick = (e) => {
    setCurrent(e.key);
  };

  const onChangeCategory = (categoryName) => {
    const selected = categories.find(
      category => categoryName === category.categoryName,
    );
    setSelectedCategory(selected);
  };

  const changePreview = (v) => {
    setView(v);
    if (visible === 'list') {
      setPreviewMode('split');
    }

    if (v === 'tour') {
      setPreviewMode('split');
    }
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      onChangeCategory(value);
    }

    const valuesToMerge = {};
    if (localizedFields.includes(name)) {
      _set(valuesToMerge, ['localization', editingLanguage, name], value);
      if (editingLanguage === defaultLocale) {
        _set(valuesToMerge, name, value);
      }
    } else {
      _set(valuesToMerge, name, value);
    }
    setValues(currentValues => _merge( // use _merge to deeply merge localization obj
      {},
      currentValues,
      valuesToMerge,
    ));
  }, [editingLanguage, onChangeCategory]);

  const setDetails = useCallback((ckData) => {
    handleInputChange({
      target: {
        name: 'details',
        value: ckData,
      },
    });
  }, [handleInputChange]);

  const onGenerate = async (e) => {
    e.preventDefault();

    const data = {
      ...values,
      filename: zipName.toLowerCase(),
      categoryInfo: selectedCategory,
    };

    const json = await axios.post(`${BASE_API}/tour/output`, data);

    setexportJsonData(json.data);
    setVisible(true);
  };

  const getHikes = async () => {
    const categoriesMaps = await getMapCategories(false);
    setSelectedCategory(categoriesMaps[0]);
    setCategories(categoriesMaps);
  };

  useEffect(() => {
    getHikes();

    // Reset Session when page refreshed/rendered
    const resetSession = async () => {
      await axios.post(`${BASE_API}/utils/reset`);
    };

    resetSession();
    return () => {};
  }, []);


  const languageOptions = locales.map(locale => (
    <Option value={locale}>
      {i18next.t(locale)}
    </Option>
  ));

  return (
    <>
      <div className={styles.header}>
        <img
          className={styles.logo}
          src={`${
            publicRuntimeConfig.asset
          }/static/dist/images/productlogo.svg`}
          alt={i18next.t('logo')}
        />
        <div>
          <p>{i18next.t('Volt MX Tutorials')}</p>
        </div>
      </div>
      <Row>
        <Col
          className={styles.pageContent}
          span={previewMode === 'full' ? 0 : 8}
        >
          {isCKEditorVisible
            ? previewMode === 'split' && (
            <div className={styles.ckEditorContainer}>
              <Button
                onClick={() => setIsCKEditorVisible(false)}
                type="button"
              >
                <Icon type="arrow-left" />
                {i18next.t('Back to Forms')}
              </Button>
              <DetailsEditor
                checksum={checksum}
                ckData={_get(values, ['localization', editingLanguage, 'details'], '')}
                onChangeData={setDetails}
              />
            </div>
            )
            : previewMode === 'split' && (
            <div className={styles.forms}>
              <FormSwitcher
                setView={handleSwitcherClick}
                current={current}
              />
              {current === 'new' && (
              <Form style={{ padding: 20 }} layout="vertical">
                <div style={{ padding: '20px 0' }}>
                  <Form.Item
                    className={styles.formContainer}
                    label={i18next.t('Checksum')}
                  >
                    <TextArea
                      style={{ color: '#1890ff' }}
                      value={values.checksum}
                      rows={2}
                    />
                  </Form.Item>
                  <Form.Item
                    className={styles.formContainer}
                    label={i18next.t('KUID')}
                  >
                    <Input
                      style={{ color: '#1890ff' }}
                      value={values.kuid}
                    />
                  </Form.Item>
                  <Form.Item
                    className={styles.formContainer}
                    label={i18next.t('Tour URL')}
                  >
                    <Input
                      name="tourLink"
                      value={values.tourLink.toLowerCase()}
                      onChange={handleInputChange}
                      placeholder={i18next.t('Add URL')}
                    />
                  </Form.Item>
                  <Form.Item
                    className={styles.formContainer}
                    label={i18next.t('Category')}
                  >
                    {categories.length > 0 && (
                    <Select
                      defaultValue={categories[0].categoryName}
                      onChange={onChangeCategory}
                    >
                      {categories.map(category => (
                        <Option value={category.categoryName}>
                          {_get(
                            category,
                            ['localization', editingLanguage, 'categoryName'],
                            category.categoryName,
                          )}
                        </Option>
                      ))}
                    </Select>
                    )}
                  </Form.Item>
                  <Divider />
                  <Form.Item
                    className={styles.formContainer}
                    label={(
                      <Row>
                        <span>{i18next.t('composer_editing_language')}</span>
                        &nbsp;
                        <Tooltip title={i18next.t('composer_editing_language_tooltip')}>
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </Row>
                    )}
                  >
                    <Select
                      onSelect={setEditingLanguage}
                      value={editingLanguage}
                    >
                      {languageOptions}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    className={styles.formContainer}
                    label={i18next.t('Title')}
                  >
                    <Input
                      name="title"
                      value={values.localization[editingLanguage].title}
                      onChange={handleInputChange}
                      placeholder={i18next.t('Add Title...')}
                    />
                  </Form.Item>
                  <Form.Item
                    className={styles.formContainer}
                    label={i18next.t('Description')}
                  >
                    <TextArea
                      name="description"
                      value={values.localization[editingLanguage].description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder={i18next.t('Add Description...')}
                    />
                  </Form.Item>
                  <Form.Item
                    className={styles.formContainer}
                    label={i18next.t('Details')}
                  >
                    <Button
                      onClick={() => {
                        setView('tour');
                        setIsCKEditorVisible(true);
                      }}
                      type="primary"
                      icon="edit"
                    >
                      {i18next.t('Open Editor')}
                    </Button>
                  </Form.Item>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        className={styles.formContainer}
                        label={i18next.t('Steps')}
                      >
                        <Input
                          min={1}
                          type="number"
                          name="cards"
                          value={values.cards}
                          onChange={handleInputChange}
                          placeholder={i18next.t('How many Steps...')}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        className={styles.formContainer}
                        label={i18next.t('Time')}
                      >
                        <Input
                          min={1}
                          type="number"
                          name="time"
                          value={values.time}
                          onChange={handleInputChange}
                          placeholder={i18next.t('Input Time...')}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button type="primary" onClick={onGenerate}>
                    {i18next.t('Generate Hike')}
                  </Button>
                  <ExportModal
                    branchName={values.tourLink}
                    jsonData={exportJsonData}
                    category={selectedCategory.categoryAlias}
                    visible={visible}
                    onClose={() => setVisible(false)}
                  />
                </div>
                <div />
              </Form>
              )}
              {current === 'edit' && <EditHike />}
            </div>
            )}
        </Col>
        <Col className={styles.preview} span={previewMode === 'full' ? 24 : 16}>
          <ul className={styles.previews}>
            {previewMode === 'split' && (
              <>
                <PreviewSwitcher
                  current={view}
                  setView={({ key }) => changePreview(key)}
                />
              </>
            )}
          </ul>
          {view === 'card' && (
            <div className={styles.cardPreview}>
              <div className={styles.previewContainer}>
                {categories.length > 0 && (
                  <>
                    <h3>
                      {_get(
                        selectedCategory,
                        ['localization', editingLanguage, 'categoryName'],
                        selectedCategory.categoryName,
                      )}
                    </h3>
                    <div
                      style={{ textAlign: 'center', width: '50%' }}
                      dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                        __html: _get(
                          selectedCategory,
                          ['localization', editingLanguage, 'categoryDescription'],
                          selectedCategory.categoryDescription,
                        ),
                      }}
                    />
                  </>
                )}
                <TourCard
                  isComposer
                  tour={{
                    title: _get(values, ['localization', editingLanguage, 'title'], values.title),
                    description: _get(values, ['localization', editingLanguage, 'description'], values.description),
                    cards: values.cards,
                    time: `${values.time} ${i18next.t('Mins')}`,
                  }}
                />
              </div>
            </div>
          )}
          {/* {view === "tour" &&
            categories.map((item) =>
              item.categoryTours !== null ? (
                <ToursList
                  key={item.categoryName}
                  title={item.categoryName}
                  desc={item.categoryDescription}
                  alias={item.categoryAlias || item.categoryName}
                  tours={item.categoryTours}
                />
              ) : null
            )} */}
          {view === 'tour' && (
            <>
              <div
                style={{
                  background: 'white',
                  padding: '10px 10px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                }}
              >
                {previewMode === 'split' ? (
                  <Button
                    onClick={() => {
                      setPreviewMode('full');
                    }}
                  >
                    <Icon type="fullscreen" />
                    {i18next.t('Full Preview')}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setPreviewMode('split');
                    }}
                  >
                    <Icon type="fullscreen-exit" />
                    {i18next.t('Close Full Preview')}
                  </Button>
                )}
              </div>
              <TourDetailPage
                previewData={{
                  ...translateCategory(values, editingLanguage),
                  time: `${values.time} ${i18next.t('Minutes')}`,
                  fileName: selectedFile.name,
                }}
                url={{ asPath: 'preview' }}
              />
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default GenerateTourPage;
