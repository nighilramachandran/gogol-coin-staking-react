import { Modal, ModalProps } from "react-bootstrap"
import "../index.scss"
export interface CustomModalProps extends ModalProps {
  title?: string
}

export function CustomModal({ children, title, ...props }: CustomModalProps) {
  return (
    <Modal
      data-testid="custom-modal"
      contentClassName="c-modal"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header data-testid="title-custom-modal" closeButton>
        {" "}
        {title && <Modal.Title data-testid="title-custom-modal">{title}</Modal.Title>}
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {/* <Modal.Footer>
        <CustomButton onClick={props.onHide}>Close</CustomButton>
      </Modal.Footer> */}
    </Modal>
  )
}
