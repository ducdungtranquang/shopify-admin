import { Button, Modal, Stack, TextField } from '@shopify/polaris';
import { useState, useCallback, useRef } from 'react';
import { handleImportImg } from './FunctionTextEditor';

export default function ModalImage({ active, setActive, img, setImg, textField }) {
    const node = useRef(null);

    const toggleModal = useCallback(() => setActive((active) => !active), []);

    const activator = <Button onClick={toggleModal}>Open</Button>;

    return (
        <div style={{ height: '500px' }}>
            <Modal
                activator={activator}
                open={active}
                onClose={toggleModal}
                title="Insert image"
                primaryAction={{
                    content: 'Insert',
                    onAction: ()=>{
                        handleImportImg(textField, img)
                        setActive(false)
                    },
                }}
                secondaryActions ={{
                    content: 'Close',
                    onAction: toggleModal,
                }}
            >
                <Modal.Section>
                    <Stack vertical>
                        <Stack.Item>
                        </Stack.Item>
                        <Stack.Item fill>
                            <TextField
                                ref={node}
                                label="Paste the image URL"
                                // onFocus={handleFocus}
                                value={img}
                                onChange={(e) => setImg(e)}
                                autoComplete="off"
                                placeholder='http://'
                            />
                        </Stack.Item>
                    </Stack>
                </Modal.Section>
            </Modal>
        </div>
    );
}