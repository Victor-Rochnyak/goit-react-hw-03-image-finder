import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { Component } from "react";
// import axios from "axios";

import ImageError from "components/ImageError/ImageError";
import Notification from "components/Notification/Notification";
import API from "components/api/api";
import ButtonLoadMore from "components/ButtonLoadMore/ButtonLoadMore";
import ImageGalleryList from "components/ImageGalleryList/ImageGalleryList";
import SearchBar from "components/SearchBar/SearchBar";

export default class App extends Component {
  state = {
    inputValue: "",
    page: 1,
    images: [],
    error: null,
    status: "idle",
    isLoading: true,
    loadBtnIsShown: false,
    totalResalts: [],
  };
// після сабміту інпут буде очищати данні та сбраувати на першу сторінку
  handleFormSubmit = (inputValue) => {
    this.setState({ inputValue, images: [], page: 1 });
  };
// кнопка ,яка добавляє до попередніх картинок другу сторінку списку
  loadMore = () => {
    this.setState((prevState) => ({
      page: prevState.page + 1,
    }));
  };

  async componentDidUpdate(_, prevState) {
    const prevName = prevState.inputValue;
    const newName = this.state.inputValue;
    const prevPage = prevState.page;
    const nextPage = this.state.page;
    
// робить перевірку при didUpdate
    if (prevPage !== nextPage || prevName !== newName) {
      this.setState({ isLoading: true, loadBtnIsShown: false });
      try {
        const images = await API.fetchImages(newName, nextPage);
// перевірка кнопки "загрузити ще, якщо картинок більше нема"
        const remainingPages = this.getRemainingPages(images.totalHits);
        if (remainingPages > 0) this.setState({ loadBtnIsShown: true });

        if (images.hits.length === 0) return this.setState({ status: "empty" });
// переписуємо state. витягуємо hits , totalHits
        this.setState((prevState) => ({
          images: [...prevState.images, ...images.hits],
          status: "resolved",
          totalResalts: images.totalHits,
        }));
      } catch (error) {
        this.setState({ error });
      }
    }
  }
//  розрахунок тотал image для кнопки "загрузити ще"
  getRemainingPages = (totalImages) => {
    return Math.ceil(totalImages / API.perPage) - this.state.page;
  };

  render() {
    const { images, error, isLoading, status, loadBtnIsShown } = this.state;

    return (
      <div>
        <SearchBar onSubmit={this.handleFormSubmit} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          theme="dark"
        />

        {status === "empty" && (
          <Notification
            notification={
              "images not found . Please try again"
            }
          />
        )}

        {status === "idle" && <h1>Please, enter your request</h1>}

        {status === "rejected" && <ImageError message={error.message} />}

        {status === "resolved" && (
          <ImageGalleryList images={images} isLoading={isLoading} />
        )}
        {loadBtnIsShown && <ButtonLoadMore onClick={this.loadMore} />}
      </div>
    );
  }
}
