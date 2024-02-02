type Props = {
  header: string;
  titlePrompt: string;
  bodyPrompt: string;
  targetName: string;
  onModalSubmit: (title: string, body: string) => void;
  onCancel?: () => void;
};
export default function ModalTitleBodyEdit({
  header,
  titlePrompt,
  bodyPrompt,
  onModalSubmit,
  onCancel,
  targetName,
}: Props) {
  /*
  <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      Create Project
    </button>
    */

  function handleOnSubmit(event) {
    event.preventDefault();
    if (event.currentTarget === null) throw new Error();
    const formData = new FormData(event.currentTarget);
    const { title, body } = Object.fromEntries(formData.entries());
    onModalSubmit(title, body);
  }
  return (
    <div
      className="modal fade"
      id={targetName}
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      style={{ display: 'none' }}
      aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
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
              <div className="mb-3">
                <label htmlFor="body-text" className="col-form-label">
                  {bodyPrompt}
                </label>
                <textarea
                  name="body"
                  className="form-control"
                  id="body-text"></textarea>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              onClick={onCancel}
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
