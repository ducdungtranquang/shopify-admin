import { Button, Modal, Stack, TextContainer, TextField } from '@shopify/polaris';
import { useState, useCallback, useRef } from 'react';
import { handleImportVideo } from './FunctionTextEditor';

export default function ModalVideo({ active, setActive, video, setVideo, textField }) {
    const node = useRef(null);

    const toggleModal = useCallback(() => setActive((active) => !active), []);

    const activator = <Button onClick={toggleModal}>Open</Button>;

    return (
        <div style={{ height: '500px' }}>
            <Modal
                activator={activator}
                open={active}
                onClose={toggleModal}
                title="Insert video"
                primaryAction={{
                    content: 'Insert',
                    onAction: ()=>{
                        handleImportVideo(textField, video)
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
                                label="Insert the video by pasting the embed code in the box below."
                                // onFocus={handleFocus}
                                value={video}
                                onChange={(e) => setVideo(e)}
                                autoComplete="off"
                                helpText="Embed snippets usually start with '<iframe ...'"
                                multiline={3}
                            />
                        </Stack.Item>
                    </Stack>
                </Modal.Section>
            </Modal>
        </div>
    );
}