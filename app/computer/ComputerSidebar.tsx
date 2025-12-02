import { Fragment } from "react";

export default function ComputerSidebar() {
    return (
        <Fragment>
            <p>
                <img
                    draggable="false"
                    src="https://98.js.org/images/icons/hard-disk-drive-32x32.png"
                />
            </p>
            <p className="Title">(C:)</p>
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
            <div id="Media"></div>
        </Fragment>
    )
}