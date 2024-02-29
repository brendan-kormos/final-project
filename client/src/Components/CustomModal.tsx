import { useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
type Props = {
  isOpen: boolean;
  header: string;
  titlePrompt: string;
  bodyPrompt: string;
  showBody: boolean;
  onSubmit: (title: string, body: string) => void;
  onClose: () => void;
  onCancel?: () => void;
};
export default function CustomModal({
  isOpen,
  header,
  titlePrompt,
  bodyPrompt,
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
  if (1 === 1)
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
              <Form.Label className="col-form-label">
                {titlePrompt}
              </Form.Label>
              <Form.Control placeholder="" type="text" name="title" />
              {/* </div> */}
            </Form.Group>
            <Form.Group controlId="body" className="mb-3">
              <Form.Label className="col-form-label">{bodyPrompt}</Form.Label>
              <Form.Control
                as="textarea"
                name="body"
                className="form-control"></Form.Control>
            </Form.Group>
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
  console.log('passed');
  return (
    <div
      className="modal d-block fade show"
      data-backdrop="static"
      data-keyboard="false"
      tabIndex={-1}
      aria-labelledby="modalLabel"
      aria-hidden="true">
      <div className="modal-dialog modal-dialog modal-dialog-centered">
        <form onSubmit={handleOnSubmit} className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {header}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>

          <div className="modal-body">
            <div>
              <div className="mb-3">
                <label htmlFor="modal-title" className="col-form-label">
                  {titlePrompt}
                </label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  id="modal-title"
                />
              </div>

              {showBody && (
                <div className="mb-3">
                  <label htmlFor="body-text" className="col-form-label">
                    {bodyPrompt}
                  </label>
                  <textarea
                    name="body"
                    className="form-control"
                    id="body-text"></textarea>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              // onClick={onCancel}
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
