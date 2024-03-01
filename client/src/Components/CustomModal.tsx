import { Button, Form } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
type Props = {
  isOpen: boolean;
  header: string;
  titlePrompt: string;
  titleContent?: string;
  bodyPrompt: string;
  bodyContent?: string;
  showBody: boolean;
  onSubmit: (title: string, body: string) => void;
  onClose: () => void;
  onCancel?: () => void;
};
export default function CustomModal({
  isOpen,
  header,
  titlePrompt,
  titleContent,
  bodyPrompt,
  bodyContent,
  onSubmit,
  onCancel,
  showBody,
  onClose,
}: Props) {
  if (!isOpen) return null;
  console.log('modal open');
  const handleOnSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget === null) throw new Error();
    const formData = new FormData(event.currentTarget);
    const { title, body } = Object.fromEntries(formData.entries());
    onSubmit(title, body);
  };
  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <Form
        onSubmit={function (event) {
          event.preventDefault();
          if (event.currentTarget === null) throw new Error();
          const formData = new FormData(event.currentTarget);
          const { title, body } = Object.fromEntries(formData.entries());
          onSubmit(title, body);
          onClose();
        }}>
        <Modal.Header closeButton>
          <Modal.Title>{header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="title" className="mb-3">
            {/* <div className="mb-3"> */}
            <Form.Label className="col-form-label">{titlePrompt}</Form.Label>
            <Form.Control
              placeholder=""
              type="text"
              name="title"
              defaultValue={titleContent}
            />
            {/* </div> */}
          </Form.Group>
          {showBody && (
            <Form.Group controlId="body" className="mb-3">
              <Form.Label className="col-form-label">{bodyPrompt}</Form.Label>
              <Form.Control
                as="textarea"
                name="body"
                className="form-control"
                defaultValue={bodyContent}
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              if (onCancel) onCancel();
              if (onClose) onClose();
            }}
            type="button"
            className="btn btn-secondary">
            Cancel
          </Button>
          <Button type="submit" className="btn btn-primary">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
