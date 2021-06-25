import React, { Component } from "react";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import Col from "antd/lib/col";
import Modal from "antd/lib/modal";
import Router from "next/router";
import style from "./style.scss";
import getConfig from "next/config";
import { BASE_PATH_URL, isDev } from "../../config";
const { publicRuntimeConfig } = getConfig();

class HikeSearch extends Component {
  state = {
    keyword: this.props.keyword || "",
  };

  handleSearchClick = () => {
    this.handleSubmit(document.getElementById("search").value);
  };

  handleSubmit = (keyword) => {
    const searchTerm = keyword.trim().replace(/\\|\/|  +/g, " ");
    if (searchTerm.length > 2) {
      const URL = !isDev ? BASE_PATH_URL : "";
      const searchUrl = `${URL}/hikes/search?keyword=${searchTerm}`;
      Router.replace(searchUrl);
    } else {
      Modal.error({
        title: "Please enter minimum 3 characters",
      });
      return false;
    }
  };

  render() {
    return (
      <div className={style.searchWrapper} ref={this.setWrapperRef}>
        <Col span={24} className={style.innerWrapper}>
          <Input
            id="search"
            placeholder="Search"
            className={style.input}
            onPressEnter={(e) => this.handleSubmit(e.target.value)}
            autoComplete="off"
            defaultValue={this.state.keyword}
          />
          <Button
            type="primary"
            shape="circle"
            size="default"
            className={style.searchIcon}
            onClick={this.handleSearchClick}
          >
            <img
              src={`${publicRuntimeConfig.asset}/static/dist/images/search.svg`}
              alt="search icon"
            />
          </Button>
        </Col>
      </div>
    );
  }
}

export default HikeSearch;
