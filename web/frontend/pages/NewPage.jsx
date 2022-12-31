import { useNavigate, useParams } from 'react-router-dom';
import TextEditer from '../components/TextEditor';
import { Page, Card, Grid, FormLayout, TextField, ChoiceList, Button, Stack, Icon, OptionList, DatePicker, Scrollable, TextContainer, Select, PageActions, Modal, } from '@shopify/polaris';
import { CalendarMinor, ClockMajor } from '@shopify/polaris-icons';
import React, { useRef } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import { optionTime } from '../components/optionTime';
import { headers } from '../constant';
export default function updatePage() {
    const fetchAPI = useAuthenticatedFetch();
    const navigate = useNavigate();
    const [activeModale, setActiveModle] = useState(false);
    const [title, setTitle] = useState('');
    const [handle, setHandle] = useState();
    const [dates, setDates] = useState(true);
    const [selected, setSelected] = useState(['visible']);
    const [selecTime, setSelecTime] = useState('10:00 AM');
    const [checkDate, setCheckDate] = useState(false);
    const [checkTime, setCheckTime] = useState(false);
    const [checkActionSe, setCheckActionSeo] = useState(false);
    const [checkIsPublished, setCheckIsPublished] = useState(new Date());
    const [titlePage, setTitlePage] = useState();
    const [description, setDescription] = useState('');
    const [active, setActive] = useState(false);
    const [getDate, setGetDate] = useState(8);
    const [url, setUrl] = useState('');
    const [selectTemplate, setSelectTemplate] = useState('');
    const [err, setErr] = useState(false);
    const [selectedDates, setSelectedDates] = useState({
        start: new Date(),
        end: new Date(),
    });

    const editor = useRef();

    const handleSelectChange = useCallback(
        (value) => setSelectTemplate(value),
        []
    );

    const callApi = async () => {
        // const res = await fetchAPI(`/api/get/${id}`, {
        //     method: 'GET',
        //     headers
        // })
        // const data = await res.json();
        // setTitle(data.title);
        // setUrl(data.handle);
        // setCheckIsPublished(data.published);
        // console.log(title);
    }

    const toggleActive = async () => {
        if (title !== "") {
            await updatePage();
            setActive((active) => !active);
            navigate('/');
        }
        else setErr(true)
    };

    const handleChange = (value) => {
        setSelected(value);
        if (value == 'hidden') {
            setCheckIsPublished(false);
        } else {
            setCheckIsPublished(true);
            setDates(true)
        }
    };
    const handleChangeModel = useCallback(
        () => setActiveModle(!activeModale),
        [activeModale]
    );

    const [{ month, year }, setDate] = useState({
        month: 8,
        year: 2022,
    });

    const handleMonthChange = useCallback(
        (month, year) => setDate({ month, year }),
        []
    );

    const handleSetDate = () => {
        setDates(false);
        setSelected('Hidden');
    };
    const handleCleardate = () => {
        setDates(true);
    };

    const options = [
        { label: 'Default page', value: '' },
        { label: 'contact', value: 'contact' },
    ];

    const actionsSeo = () => {
        if (checkActionSe === false) {
            setCheckActionSeo(true);
        } else {
            setCheckActionSeo(false);
        }
    };

    const updatePage = async () => {
        const res = await fetchAPI("/api/page/create", {
            method: "POST",
            headers,
            body: JSON.stringify(
                {
                    title: title,
                    body: editor.current.querySelector('iframe').contentWindow.document.querySelector('body').innerHTML,
                    published: checkIsPublished,
                    handle: url.split(" ").join('_'),
                    template_suffix: selectTemplate,
                }
            ),
        })
        console.log(res);
    };

    return (
        <>
            {activeModale ? (
                <div style={{ height: '500px' }}>
                    <Modal
                        open={activeModale}
                        onClose={handleChangeModel}
                        title="You have unsaved changes"
                        primaryAction={{
                            content: 'Leave Page',
                            destructive: true,

                            onAction: () => {
                                navigate('/');
                            },
                        }}
                        secondaryActions={[
                            {
                                content: 'Cancel',
                                onAction: () => {
                                    setActiveModle(false);
                                },
                            },
                        ]}
                    >
                        <Modal.Section>
                            <TextContainer>
                                <p>
                                    If you leave this page, all unsaved changes will be
                                    lost.
                                </p>
                            </TextContainer>
                        </Modal.Section>
                    </Modal>
                </div>
            ) : null}

            <Page
                breadcrumbs={[
                    {
                        content: 'Settings',
                        onAction: () => {
                            setActiveModle(true);
                        },
                    },
                ]}
                title="General"
            ></Page>
            <Page>
                <Grid>
                    <Grid.Cell
                        columnSpan={{ xs: 8, sm: 3, md: 3, lg: 8, xl: 8 }}
                    >
                        <Card>
                            <Card sectioned>
                                <FormLayout>
                                    <TextField
                                        label="Title"
                                        placeholder="e.g Contact us, Sizing chart, FAQs "
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e);
                                            setErr(false);
                                        }}
                                        autoComplete="off"
                                    />
                                    {err?<div style={{color:"#d72c0d", fontWeight:"500", marginTop:"-10px"}}>! Title is not emty</div>:null}
                                </FormLayout>
                                <div style={{ marginTop: "12px", marginBottom: "3px" }}>Content</div>
                                <div ref={editor}>
                                    <TextEditer />
                                </div>
                            </Card>
                            <Card
                                sectioned
                                title="Search engine listing preview"
                                actions={[
                                    {
                                        content: 'Edit website SEO',
                                        onAction: actionsSeo,
                                    },
                                ]}
                            >
                                {checkActionSe === false ? (
                                    <>
                                        <p>
                                            Add a title and description to see how this Page
                                            might appear in a search engine listing
                                        </p>
                                        <p className="rUXT">{title}</p>
                                        {title !== undefined && (
                                            <p className="XNE1s">
                                                {` https://admin1002.myshopify.com/pages/${url
                                                    .split(' ')
                                                    .join('_')} `}
                                            </p>
                                        )}
                                        <p>{description}</p>
                                    </>
                                ) : <>
                                    <p className="rUXT">{titlePage || title}</p>
                                    <p className="XNE1s">
                                        {` https://admin1002.myshopify.com/pages/${url
                                            .split(' ')
                                            .join('_')} `}
                                    </p>
                                    <p>{description}</p>
                                </>}
                            </Card>
                            {checkActionSe === true ? (
                                <Card sectioned>
                                    <FormLayout>
                                        <TextField
                                            label="Page title"
                                            value={titlePage}
                                            defaultValue={title}
                                            onChange={(e) => {
                                                setTitlePage(e);
                                            }}
                                            autoComplete="off"
                                        />
                                        <TextField
                                            label="Description"
                                            value={description}
                                            onChange={(e) => {
                                                setDescription(e);
                                            }}
                                            autoComplete="off"
                                        />
                                        <TextField
                                            label="URL and handle"
                                            value={url}
                                            onChange={(e) => {
                                                setUrl(e);
                                            }}
                                            autoComplete="off"
                                        />
                                    </FormLayout>
                                </Card>
                            ) : null}
                        </Card>
                    </Grid.Cell>
                    <Grid.Cell
                        columnSpan={{ xs: 4, sm: 3, md: 3, lg: 4, xl: 4 }}
                    >
                        <Card title="Visibility" sectioned>
                            <ChoiceList
                                choices={[
                                    { label: `Visible (${new Date()})`, value: 'visible' },
                                    { label: 'Hidden', value: 'hidden' },
                                ]}
                                selected={selected}
                                onChange={handleChange}
                            />
                            {dates === true ? (
                                <Button plain onClick={handleSetDate}>
                                    Set visibility date
                                </Button>
                            ) : <>
                                <Stack distribution="fillEvenly">
                                    <div> Visibility date</div>

                                    <TextField
                                        value={`${month}/${getDate}/${year}`}
                                        prefix={
                                            <Icon source={CalendarMinor} color="base" />
                                        }
                                        autoComplete="off"
                                        onFocus={() => setCheckDate(true)}
                                    />
                                    {checkDate &&
                                        <DatePicker
                                            month={month}
                                            year={year}
                                            onChange={(e) => {
                                                setSelectedDates,
                                                    setCheckDate(false),
                                                    setGetDate(e.start.getDate())
                                            }}
                                            onMonthChange={handleMonthChange}
                                        // selected={selectedDates}
                                        />
                                    }
                                    <TextField
                                        value={selecTime}
                                        prefix={
                                            <Icon source={ClockMajor} color="base" />
                                        }
                                        autoComplete="off"
                                        onFocus={() => setCheckTime(true)}
                                    />
                                    {checkTime ? (
                                        <Scrollable
                                            shadow
                                            style={{ height: '250px' }}
                                            focusable
                                        >
                                            <OptionList
                                                title="Inventory Location"
                                                onChange={(e) => {
                                                    setSelecTime(e);
                                                    setCheckTime(false);
                                                }}
                                                options={optionTime}
                                                selected={selecTime}
                                            />
                                        </Scrollable>
                                    ) : null}
                                </Stack>
                                <Button plain onClick={handleCleardate}>
                                    Clear date...
                                </Button>
                            </>}
                        </Card>
                        <Card title="Online Store" sectioned>
                            <TextContainer>
                                <Select
                                    label="Theme template"
                                    options={options}
                                    onChange={handleSelectChange}
                                    value={selectTemplate}
                                />
                                <p>
                                    Assign a template from your current theme to define
                                    how the page is displayed.
                                </p>
                            </TextContainer>
                        </Card>
                    </Grid.Cell>
                </Grid>
                <PageActions
                    primaryAction={{
                        content: 'Save',
                        onAction: () => {
                            toggleActive();
                        },
                    }}
                    secondaryActions={[
                        {
                            content: 'Cancel',
                            onAction: () => {
                                setActiveModle(true);
                            },
                        },
                    ]}
                />
            </Page>
        </>
    );
}