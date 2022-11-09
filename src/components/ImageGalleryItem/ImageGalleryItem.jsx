
import Modal from "components/Modal/Modal";
import React, { Component } from "react";

export default class ImageGalleryItem extends Component {
  state = {
    modalIsOpen: false,
  };

  toggleModal = () => {
    this.setState(({ modalIsOpen }) => ({
      modalIsOpen: !modalIsOpen,
    }));
  };
  render() {
    const { smallImage, largeImage} = this.props;
    const { modalIsOpen } = this.state;

    return (
      <>
        <li className="ImageGalleryItem" onClick={this.toggleModal}>
            <img
              className="ImageGalleryItem-image"
              src={smallImage}
              alt='tags'
            />
        </li>
        {modalIsOpen && (
          <Modal closeModal={this.toggleModal}>
            <img src={largeImage} alt='tags' />
          </Modal>
        )}
      </>
    );
  }
}
