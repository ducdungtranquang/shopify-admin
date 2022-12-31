import { Button, Modal, Stack, TextContainer, TextField } from '@shopify/polaris';
import { useState, useCallback, useRef } from 'react';
import {  createLink} from './FunctionTextEditor';

export default function ModalLink({ active, setActive, link, setLink, textField }) {
    const node = useRef(null);

    const toggleModal = useCallback(() => setActive((active) => !active), []);

    const activator = <Button onClick={toggleModal}>Open</Button>;

    return (
        <div style={{ height: '500px' }}>
            <Modal
                activator={activator}
                open={active}
                onClose={toggleModal}
                title="Insert link"
                primaryAction={{
                    content: 'Insert',
                    onAction: ()=>{
                        createLink(textField, link)
                        setActive(false)
                    },
                }}
                secondaryActions ={{
                    content: 'Close',
                    onAction: toggleModal,
                }}
                noScroll
            >
                <Modal.Section>
                    <Stack vertical>
                        <Stack.Item>
                        </Stack.Item>
                        <Stack.Item fill>
                            <TextField
                                ref={node}
                                label="Link to"
                                // onFocus={handleFocus}
                                value={link}
                                onChange={(e) => setLink(e)}
                                autoComplete="off"
                                helpText="External links are required to have http://"
                            />
                        </Stack.Item>
                    </Stack>
                </Modal.Section>
            </Modal>
        </div>
    );
}