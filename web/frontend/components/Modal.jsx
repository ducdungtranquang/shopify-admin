import { useNavigate, useParams } from "react-router-dom";
import { TextContainer } from "@shopify/polaris";
import { Modal } from "@shopify/polaris";
export default function ModalComponent({ activeModale, setActiveModle, handleChangeModel }) {
    const navigate = useNavigate();
    return (
        <>
            {activeModale === true && <div style={{ height: '500px' }}>
                <Modal
                    // activator={activator}
                    open={activeModale}
                    onClose={handleChangeModel}
                    title="You have unsaved changes"
                    primaryAction={{
                        content: 'Leave Page',
                        destructive: true,
                        onAction: () => { navigate("/") },
                    }}
                    secondaryActions={[
                        {
                            content: 'Cancel',
                            onAction: () => { setActiveModle(false) }
                        },
                    ]}
                >
                    {/* <Modal.Section> */}
                    {/* <TextContainer>
                        <p>
                            If you leave this page, all unsaved changes will be lost.
                        </p>
                    </TextContainer> */}
                    {/* </Modal.Section> */}
                    <Modal.Section>
                        <TextContainer>
                            <p>
                                If you leave this page, all unsaved changes will be lost.
                            </p>
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            </div>}
        </>
    )
}