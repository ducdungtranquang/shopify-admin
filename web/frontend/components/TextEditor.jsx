import { Button, ButtonGroup, Tooltip, Popover, ActionList, ColorPicker, Tabs } from "@shopify/polaris";
import { useEffect, useRef, useState, useCallback } from "react"
import {
    EmbedMinor,
    CircleDisableMinor,
    LinkMinor
} from '@shopify/polaris-icons';
import { handleClickBtn, handleClickHeading, handleChangeColor, showCode } from "./FunctionTextEditor";
import ModalVideo from "./ModalVideo";
import ModalImage from "./ModalImage";
import ModalLink from "./ModalLink";
import { useAuthenticatedFetch } from "../hooks";
import { headers } from "../constant";

export default function TextEditer({ id }) {
    const fetchAPI = useAuthenticatedFetch();
    const textarea = useRef();
    const [showColor, setShowColor] = useState(false);
    const [popoverActive, setPopoverActive] = useState(false);
    const [active, setActive] = useState(false);
    const [activeImg, setActiveImg] = useState(false);
    const [activeLink, setActiveLink] = useState(false)
    const [video, setVideo] = useState('');
    const [img, setImg] = useState('');
    const [link, setLink] = useState('');
    const [show, setShow] = useState(true);
    const [data, setData] = useState('')
    const [color, setColor] = useState({
        hue: 120,
        brightness: 1,
        saturation: 1,
    });
    const [selected, setSelected] = useState(0);

    const stringToHTML = (str) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    };

    const callApi = async (textField) => {
        const res = await fetchAPI(`/api/get/${id}`, {
            method: 'GET',
            headers
        })
        const dat = await res.json();
        const data = dat.body_html;
        const body = stringToHTML(data)
        textField.document.querySelector("body").innerHTML = data !== "" && data !== undefined ? body.innerHTML : ""

    }

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );

    const items = [
        { content: 'title 1', value: "h1" }, { content: 'title 2', value: "h2" },
        { content: 'title 3', value: "h3" }, { content: 'title 4', value: "h4" },
        { content: 'title 5', value: "h5" }, { content: 'title 6', value: "h6" },
        { content: "clear", value: "p" }
    ]

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

    const activator = (
        <Button size="slim" type="button"
            onClick={togglePopoverActive}
            className="btn shadow-sm btn-outline-secondary"
            title="Center Align"
            disclosure
            textAlign="start"
        >
            A
        </Button>
    );

    const handleFocus = e => {
        // textarea.current.style.border = "1px solid rgba(44, 110, 203, 1)"
        // textarea.current.style.outline = "none"
        console.log('..');
    }
    const handleBlur = () => {
        // textarea.current.style.border = "0"
        // textarea.current.style.borderTop = "1px solid #babfc3"
        console.log('blur');
    }

    const handleChnageColor = e => {
        setColor(e)
        handleChangeColor(textField, color, selected);
    }

    const tabs = [
        {
            id: 'all-text-1',
            content: 'Text',
            panelID: 'all-text-content-1',
        },
        {
            id: 'accepts-background-1',
            content: 'Background',
            panelID: 'accepts-background-content-1',
        }
    ]

    useEffect(() => {
        textField.document.designMode = "on";
    }, [])

    useEffect(() => {
        callApi(textField);
    }, [])

    useEffect(() => {
        if (textarea.current) {
            textarea.current.addEventListener('focus', handleFocus);
        }
        return () => {
            if (textarea.current) {
                textarea.current.removeEventListener('focus', handleFocus);
            }
        };
    }, []);

    return (
        <div style={{ border: "1px solid #babfc3" }}>
            <div style={{ display: "flex", justifyContent: show === false ? "right" : "space-between", padding: "6px", marginBottom: "6px" }}>
                {show ? (
                    <div className="row" style={{ width: "85%", }}>
                        <div className="col" style={{ display: "flex", flexWrap: "wrap" }}>

                            <div style={{ marginBottom: "6px" }}>
                                <ButtonGroup segmented>

                                    <Tooltip content="Format" dismissOnMouseOut>
                                        <Popover
                                            active={popoverActive}
                                            activator={activator}
                                            autofocusTarget="first-node"
                                            onClose={togglePopoverActive}
                                        >
                                            <ActionList
                                                // onActionAnyItem={()=>handleClickHeading(textField, "h2")}
                                                actionRole="menuitem"
                                                items={items.map((item, i) => (
                                                    {
                                                        onAction: () => {
                                                            handleClickHeading(textField, item.value)
                                                            setPopoverActive((popoverActive) => !popoverActive)
                                                        },
                                                        content: item.content,
                                                    }
                                                ))}
                                            />
                                        </Popover>
                                    </Tooltip>
                                    <Tooltip content="Bold" dismissOnMouseOut>
                                        <Button size="slim" type="button"
                                            onClick={(e) => handleClickBtn(textField, e, "bold")}
                                            className=" shadow-sm btn btn-outline-secondary"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Bold Text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-bold" viewBox="0 0 16 16">
                                                <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
                                            </svg>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Italic" dismissOnMouseOut>
                                        <Button size="slim" type="button"
                                            onClick={(e) => handleClickBtn(textField, e, "italic")}
                                            className="shadow-sm btn btn-outline-success"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Italic Text">
                                            <i>I</i></Button>
                                    </Tooltip>
                                    <Tooltip content="Underline" dismissOnMouseOut>
                                        <Button size="slim" type="button"
                                            onClick={(e) => handleClickBtn(textField, e, "underline")}
                                            className=" shadow-sm btn btn-outline-primary"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Left Align">
                                            <div style={{ textDecoration: "underline" }}>U</div></Button>
                                    </Tooltip>
                                </ButtonGroup>
                            </div>

                            <div style={{ marginLeft: "6px", marginRight: "6px", marginBottom: "6px" }}>
                                <ButtonGroup segmented>
                                    <Tooltip content="" dismissOnMouseOut>
                                        <Button size="slim" type="button"
                                            onClick={(e) => handleClickBtn(textField, e, "insertUnorderedList")}
                                            className="btn shadow-sm btn-outline-secondary"
                                            title="Center Align"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                                            </svg>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="" dismissOnMouseOut>
                                        <Button size="slim" type="button"
                                            onClick={(e) => handleClickBtn(textField, e, "insertOrderedList")}
                                            className="btn shadow-sm btn-outline-secondary"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Center Align">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-ol" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" />
                                                <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z" />
                                            </svg>
                                        </Button>
                                    </Tooltip>
                                </ButtonGroup>
                            </div>

                            <div style={{ marginBottom: "6px" }}>
                                <ButtonGroup segmented>
                                    <Tooltip content="Left" dismissOnMouseOut>
                                        <Button size="slim" type="button"
                                            onClick={(e) => handleClickBtn(textField, e, "justifyLeft")}
                                            className=" shadow-sm btn btn-outline-secondary"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Bold Text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-text-left" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                            </svg>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Right" dismissOnMouseOut>
                                        <Button size="slim" type="button"
                                            onClick={(e) => handleClickBtn(textField, e, "justifyRight")}
                                            className=" shadow-sm btn btn-outline-primary"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Left Align">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-text-right" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                            </svg>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Center" dismissOnMouseOut>
                                        <Button size="slim" type="button"
                                            onClick={(e) => handleClickBtn(textField, e, "justifyCenter")}
                                            className=" shadow-sm btn btn-outline-secondary"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Bold Text"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-text-center" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                            </svg>
                                        </Button>
                                    </Tooltip>
                                    <div style={{ position: "relative" }}>
                                        <Tooltip content="Color" dismissOnMouseOut>
                                            <Button size="slim" type="button"
                                                onClick={() => setShowColor(!showColor)}
                                                className=" shadow-sm btn btn-outline-primary"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="Left Align"
                                                disclosure>
                                                <div style={{ textDecoration: "underline" }}>A</div>
                                            </Button>
                                            {showColor ? <div style={{ position: "absolute", zIndex: 10, left: '-30px', top: "20px", width: "250px" }}>
                                                <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                                                    <ColorPicker onChange={handleChnageColor} color={color} />
                                                </Tabs>
                                            </div> : null}
                                        </Tooltip>
                                    </div>
                                </ButtonGroup>
                            </div>

                            <div >
                                <ButtonGroup segmented>
                                    <Tooltip content="" dismissOnMouseOut>
                                        <Button size="slim" type="button"
                                            onClick={() => setActiveLink(true)}
                                            className="btn shadow-sm btn-outline-primary"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Right Align"
                                            icon={LinkMinor}>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Insert image" dismissOnMouseOut>
                                        <Button size="slim" type="button"
                                            onClick={() => setActiveImg(true)}
                                            className="btn shadow-sm btn-outline-primary"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Lowercase Text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
                                                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                                <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
                                            </svg>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Insert video" dismissOnMouseOut>
                                        <Button size="slim" type="button"
                                            onClick={(e) => setActive(true)}
                                            className="btn shadow-sm btn-outline-primary"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Capitalize Text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-video-fill" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z" />
                                            </svg>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Delete format" dismissOnMouseOut>
                                        <Button size="slim" type="button"
                                            onClick={(e) => handleClickBtn(textField, e, "removeFormat")}
                                            className="btn shadow-sm btn-outline-primary side"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Tooltip on top"
                                            icon={CircleDisableMinor}>
                                        </Button>
                                    </Tooltip>
                                </ButtonGroup>
                            </div>
                        </div>
                    </div>
                ) : null}

                <div>
                    <Button size="slim" icon={EmbedMinor} onClick={() => {
                        setShow(!show)
                        showCode(textField, "showCode", show)
                    }}>
                    </Button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 col-sm-3">
                </div>
                <div className="col-md-6 col-sm-9" style={{ height: "180px" }}>
                    <div className="flex-box" >
                        <iframe id="textarea1"
                            className="input shadow"
                            name="textField"
                            ref={textarea}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            style={{ fontSize: "15px", padding: "10px", width: "100%", resize: "none", height: "180px", borderRight: "0", borderLeft: "0", borderBottom: "0", borderTop: "1px solid #babfc3", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                        >
                            {data !== "" && data !== undefined ? data : ""}
                        </iframe>
                    </div>
                </div>
                <div className="col-md-3">
                </div>
            </div>

            {/*  */}
            {active && <ModalVideo active={active} setActive={setActive} video={video} setVideo={setVideo} textField={textField} />}
            {activeImg && <ModalImage active={activeImg} setActive={setActiveImg} img={img} setImg={setImg} textField={textField} />}
            {activeLink && <ModalLink active={activeLink} setActive={setActiveLink} link={link} setLink={setLink} textField={textField} />}

        </div>
    )
}