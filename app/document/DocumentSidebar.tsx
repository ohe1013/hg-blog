import { Fragment } from "react";

export default function DocumentSidebar() {
  return (
    <Fragment>
      <p>
        <img
          draggable="false"
          src="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-1.png"
        />
      </p>
      <p className="Title">My Documents</p>
      <p className="LogoLine">
        <img
          src="https://98.js.org/src/WEB//wvline.gif"
          width="100%"
          height="1px"
        />
      </p>

      <p>
        <span id="Info">Select an item to view its description.</span>
      </p>
    </Fragment>
  );
}
