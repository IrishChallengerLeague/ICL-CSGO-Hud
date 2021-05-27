import React from "react";
import "./sideboxes.scss";
import { configs, hudIdentity } from "./../../App";
import { apiUrl } from "../../api/api";

export default class SideBox extends React.Component<
  { side: "left" | "right"; hide: boolean },
  { title: string; subtitle: string; hide: boolean; image?: string }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: "Title",
      subtitle: "Content",
      hide: this.props.hide,
    };
  }

  componentDidMount() {
    configs.onChange((data: any) => {
      if (!data) return;
      const display = data.display_settings;
      if (!display) return;
      if (`${this.props.side}_title` in display) {
        this.setState({ title: display[`${this.props.side}_title`] });
      }
      if (`${this.props.side}_subtitle` in display) {
        this.setState({ subtitle: display[`${this.props.side}_subtitle`] });
      }
      if (`${this.props.side}_image` in display) {
        const imageUrl = `${apiUrl}api/huds/${
          hudIdentity.name || "dev"
        }/display_settings/${this.props.side}_image?isDev=${
          hudIdentity.isDev
        }&cache=${new Date().getTime()}`;
        const imageTest = new XMLHttpRequest();
        imageTest.open("HEAD", imageUrl, false);
        imageTest.send();
        if (imageTest.status !== 404) {
          this.setState({ image: imageUrl });
        }
      }
      if (
        display[`${this.props.side}_title`] === "" &&
        display[`${this.props.side}_subtitle`] === "" &&
        display[`${this.props.side}_image`] === ""
      ) {
        this.setState({ hide: true });
      } else {
        this.setState({ hide: false });
      }
    });
  }

  render() {
    const { image, title, subtitle, hide } = this.state;
    return (
      <div className={`sidebox ${this.props.side} ${hide ? "hide" : ""}`}>
        {title ? (
          <div className="title_container">
            <div className="title">{title}</div>
            <div className="subtitle">{subtitle ? subtitle : ""}</div>
          </div>
        ) : (
          ""
        )}
        <div className={title ? "image_container" : "image_container_full"}>
          {image ? <img src={image} id={`image_left`} alt={"Left"} /> : ""}
        </div>
      </div>
    );
  }
}
