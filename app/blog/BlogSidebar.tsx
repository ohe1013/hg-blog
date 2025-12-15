import { Fragment } from "react";

export default function BlogSidebar() {
  return (
    <Fragment>
      <p>
        <img
          draggable="false"
          src="/assets/img/notion-logo-no-background.png"
          style={{ width: 32, height: 32 }}
        />
      </p>
      <p className="Title">Blog</p>
      <p className="LogoLine">
        <img
          src="https://98.js.org/src/WEB//wvline.gif"
          width="100%"
          height="1px"
        />
      </p>

      <p>
        <span id="Info">
          Welcome to my tech blog. Here you can find my latest posts and
          thoughts.
        </span>
      </p>
    </Fragment>
  );
}
