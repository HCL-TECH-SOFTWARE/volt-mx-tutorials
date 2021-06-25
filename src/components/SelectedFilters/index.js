import React, { Component } from "react";
import Row from "antd/lib/row";
import Button from "antd/lib/button";
import KonyButton from "../KonyButton";
import style from "./style.scss";

export default class SelectedFilters extends Component {
  handleSelect = async (filter, id) => {
    await this.props.select(filter, id);
  };

  render() {
    const { filters, clear, hideDomain } = this.props;
    return (
      <Row className={style.selectedFilters}>
        {filters.mpType
          ? filters.mpType
            .filter(x => x.selected)
            .map(item => (
              <KonyButton
                title={item.title}
                selected
                key={item.id}
                type="filter"
                onClick={() => this.handleSelect("mpType", item.id)}
              />
            ))
          : null}
        {filters.subdomain
          ? filters.subdomain
            .filter(x => x.selected)
            .map(item => (
              <KonyButton
                title={item.title}
                key={item.id}
                selected
                type="filter"
                onClick={() => this.handleSelect("subdomain", item.id)}
              />
            ))
          : null}
        {filters.domain && !hideDomain
          ? filters.domain
            .filter(x => x.selected)
            .map(item => (
              <KonyButton
                title={item.title}
                key={item.id}
                selected
                type="filter"
                onClick={() => this.handleSelect("domain", item.id)}
              />
            ))
          : null}
        {filters.channels
          ? filters.channels
            .filter(x => x.selected)
            .map(item => (
              <KonyButton
                title={item.title}
                key={item.id}
                selected
                type="filter"
                onClick={() => this.handleSelect("channels", item.id)}
              />
            ))
          : null}
        {filters.category
          ? filters.category
            .filter(x => x.selected)
            .map(item => (
              <KonyButton
                title={item.title}
                key={item.id}
                selected
                type="filter"
                onClick={() => this.handleSelect("category", item.id)}
              />
            ))
          : null}

        {filters.nfiversion
          ? filters.nfiversion
            .filter(x => x.selected)
            .map(item => (
              <KonyButton
                title={item.title}
                selected
                key={item.id}
                type="filter"
                onClick={() => this.handleSelect("nfiversion", item.id)}
              />
            ))
          : null}
        {filters.platform
          ? filters.platform
            .filter(x => x.selected)
            .map(item => (
              <KonyButton
                title={item.title}
                selected
                key={item.id}
                type="filter"
                onClick={() => this.handleSelect("platform", item.id)}
              />
            ))
          : null}

        {filters.tags
          ? filters.tags
            .filter(x => x.selected)
            .map(item => (
              <KonyButton
                title={item.title}
                selected
                key={item.id}
                type="filter"
                onClick={() => this.handleSelect("tags", item.id)}
              />
            ))
          : null}
        <Button className={style.clearAll} onClick={clear}>
          Clear all
        </Button>
      </Row>
    );
  }
}
