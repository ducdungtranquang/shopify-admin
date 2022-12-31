import { Card, ResourceList, ResourceItem, Filters, TextField, Button, ChoiceList, Popover, Stack, Badge } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import {
    StarOutlineMinor,
    SortMinor,
    StarFilledMinor
} from '@shopify/polaris-icons';
import { useAuthenticatedFetch } from "../hooks";
import { headers } from '../constant';
import { useNavigate } from 'react-router-dom';

export default function ResourceListItem() {
    const navigate = useNavigate();
    const fetchAPI = useAuthenticatedFetch();
    const [selectedItems, setSelectedItems] = useState([]);
    const [taggedWith, setTaggedWith] = useState("");
    const [queryValue, setQueryValue] = useState(null);
    const [visibility, setVisibility] = useState("");
    const [productType, setProductType] = useState("");
    const [itemFilter, setItemFilter] = useState(null);
    const [empty, setIsEmty] = useState(true);
    const [popoverActive, setPopoverActive] = useState(true);
    const [rule, setRule] = useState([])
    const [items, setItems] = useState([])
    const [backupData, setBackupData] = useState([]);

    const callApi = async () => {
        const res = await fetchAPI('/api/pages/get/all', {
            method: 'GET',
            headers,
        })
        const data = await res.json()
        setItems(data);
        setBackupData(data);
        console.log(data);
    }

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

    const handleAvailabilityChange = useCallback(
        async (value) => {
            const fitItem = backupData.filter(e => {
                if (value[0] === "Visibility") {
                    console.log("lll");
                    return e.published_at !== null
                }
                else {
                    console.log('...');
                    return e.published_at === null
                }
            });
            setVisibility(value);
            console.log(value);
            // console.log(fitItem);
            setItems(fitItem);
        }, []);

    const handleFiltersQueryChange = useCallback(
        (value) => {
            // setItemQuery(value);
            setQueryValue(value);
            console.log(value);
        },
        [],
    )

    const handleAvailabilityRemove = useCallback(() => setVisibility(""), []);
    const handleProductTypeRemove = useCallback(() => setProductType(""), []);
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);

    const resourceName = {
        singular: 'customer',
        plural: 'customers',
    };

    // function isEmpty(value) {
    //     if (Array.isArray(value)) {
    //         return value.length === 0;
    //     } else {
    //         return value === '' || value == null;
    //     }
    // }

    const appliedFilters = [];
    if (visibility !== "") {
        const key = 'visibility';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, visibility),
            onRemove: handleAvailabilityRemove,
        });
    }

    const filters = [
        {
            key: "visibility",
            label: "Visibility",
            filter: (
                <ChoiceList
                    title="Visibility"
                    titleHidden
                    choices={[
                        { label: 'Visible', value: 'Visibility' },
                        { label: 'Hiden', value: 'Hiden' },
                    ]}
                    selected={visibility || []}
                    onChange={handleAvailabilityChange}
                />
            ),
            shortcut: true
        }
    ];
    const handleRule = (value) => {
        setRule(value);
        if (value[0] === 'Z-A') {
            setItems(
                items.sort((a, b) => b.title.localeCompare(a.title, "fr", { ignorePunctuation: true }))
            );
        }
        else if (value[0] === 'A-Z') {
            setItems(
                items.sort((a, b) => a.title.localeCompare(b.title, "fr", { ignorePunctuation: true }))
            );
        }
        else if (value[0] === 'Oldest') {
            setItems(
                items.sort(
                    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
                )
            );
        }
        else if (value[0] === 'Latest') {
            setItems(
                items.sort(
                    (a, b) => new Date(a.updated_at) - new Date(b.updated_at)
                )
            );
        }
    };

    const activator = (
        <Button icon={SortMinor} onClick={togglePopoverActive}>Classify</Button>
    );

    function disambiguateLabel(key, value) {
        switch (key) {
            case 'visibility':
                return `Visibility with ${value}`;
            default:
                return value;
        }
    }

    const stringToHTML = (str) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    };

    const bulkActions = [
        {
            content: 'Make selected pages visible',
            onAction: async () => {
                const res = selectedItems.map(async (item) => {
                    let res = await fetchAPI(`/api/update/${item}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({
                            id: item,
                            published: true,
                        }),
                    });
                    console.log(res);
                });
                await Promise.all(res);
                await callApi();
                setSelectedItems([]);
                setRule('A-Z');
            },
        },
        {
            content: 'Hide selected pages',
            onAction: async () => {
                const res = selectedItems.map(async (item) => {
                    let re = await fetchAPI(`/api/update/${item}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({
                            id: item,
                            published: false,
                        }),
                    });

                });
                await Promise.all(res);
                await callApi();
                setSelectedItems([]);
                setRule('A-Z');
            },
        },
        {
            content: 'Delete pages',
            onAction: async () => {
                console.log("del");
                const res = selectedItems.map(async (id) => {
                    await fetchAPI(`/api/delete/${id}`, {
                        method: 'DELETE',
                        headers,
                    })
                });
                await Promise.all(res);
                await callApi();
                setSelectedItems([]);
            },
            destructive: true,
        },
    ];

    const handleFiltersClearAll = useCallback(() => {
        handleAvailabilityRemove();
        handleProductTypeRemove();
        handleTaggedWithRemove();
        handleQueryValueRemove();
    }, [
        handleAvailabilityRemove,
        handleQueryValueRemove,
        handleProductTypeRemove,
        handleTaggedWithRemove,
    ]);

    const filterControl = (
        <Filters
            queryValue={queryValue}
            filters={filters}
            appliedFilters={appliedFilters}
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={handleQueryValueRemove}
            onClearAll={handleFiltersClearAll}
        >
            <div style={{ paddingLeft: '8px', display: "inline-block" }}>
                <Button disabled={visibility !== "" ? false : true} icon={visibility !== "" ? StarOutlineMinor : StarFilledMinor} onClick={() => console.log('New filter saved')}>Save filters</Button>
            </div>
            <div style={{ paddingLeft: '8px', display: "inline-block", }}>
                <Popover
                    active={popoverActive}
                    sectioned={false}
                    activator={activator}
                    autofocusTarget="first-node"
                    onClose={togglePopoverActive}
                >
                    <div style={{ padding: "6px", paddingLeft: "20px", marginRight: "12px" }}>
                        <div style={{ color: "#6d7175", paddingLeft: "6px", padding: "10px" }}>Sort by</div>
                        <ChoiceList
                            title="Sort by"
                            titleHidden
                            choices={[
                                { label: 'Latest updates', value: 'Latest' },
                                { label: 'Oldest updates', value: 'Oldest' },
                                { label: 'Title A-Z', value: 'A-Z' },
                                { label: 'Title Z-A', value: 'Z-A' },
                            ]}
                            selected={rule || []}
                            onChange={handleRule}
                        />
                    </div>
                </Popover>
            </div>
        </Filters>
    );

    // 

    useEffect(() => {
        callApi();
        stringToHTML("<b>hehe</b>")
        console.log(stringToHTML("<b>hehe</b>").textContent);
    }, [empty])

    useEffect(() => {
        if (queryValue !== "") {
            setIsEmty(false)
            setItemFilter(items.filter(item => item.title.indexOf(queryValue) > -1));
            console.log(items.filter(item => item.title.indexOf(queryValue) > -1));
        }
        else {
            setIsEmty(true)
            callApi();
        }
    }, [queryValue]);

    useEffect(() => {
        if (visibility === "" || visibility === null || visibility === undefined || visibility === []) {
            callApi()
        }
    }, [visibility])

    return (
        <Card>
            <ResourceList
                resourceName={resourceName}
                items={queryValue !== null & queryValue !== "" ? itemFilter : items}
                renderItem={renderItem}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                filterControl={filterControl}
                bulkActions={bulkActions}
                loading={items ? false : true}
            />
        </Card>
    );

    function renderItem(item, _, index) {
        const { id, title, handle, published_at, body_html, updated_at } = item;
        const body_ = stringToHTML(body_html).textContent;
        const hidden = [
            {
                content: 'Preview page',
                onAction: () => {
                    window.open(`https://admin1002.myshopify.com/pages/${handle}`)
                },
            },
        ];
        const visible = [
            {
                content: 'View page',
                onAction: () => {
                    window.open(`https://admin1002.myshopify.com/pages/${handle}`)
                },
            },
        ];

        return (
            <ResourceItem
                shortcutActions={published_at === null ? hidden : visible}
                onClick={() => navigate(`/${id}`)}
                id={id}
                sortOrder={index}
                accessibilityLabel={`View details for ${title}`}
            >
                <h3>
                    <Stack>
                        <div style={{ fontWeight: 600 }}>{title}</div>
                        {published_at === null && <Badge>Hidden</Badge>}
                    </Stack>
                </h3>
                <div>{body_}</div>
                <div>{new Date(updated_at).toLocaleString('en-US')}</div>
            </ResourceItem>
        );
    }
}