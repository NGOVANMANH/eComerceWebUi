import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';

const Popup = (props) => {
    return (
        <Modal {...props} size={props.size ? props.size : 'lg'} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    {props.children}
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={props.onHide}>Close</button>
            </Modal.Footer>
        </Modal>
    );
}

export default Popup;
