import './kullanici.css';
import SearchBar from './SearchBar';
import React, { Component, useState, useEffect } from 'react';
import { Container, Row, Col, Table, Pagination, Form, Button, Alert, Modal, ListGroup} from "react-bootstrap";



const Hasta = () => {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({
        tcKimlik: '',
        hastaneKimlik: '',
        ad: '',
        soyad: '',
        gender: '',
        role: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageItems, setPageItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [searchQuery, setSearchQuery] = useState('');


    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    const filterUsers = (user) => {
      const fullName = `${user.ad} ${user.soyad}`.toLowerCase();
      const tcKimlik = user.tcKimlik.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) || tcKimlik.includes(searchQuery.toLowerCase());
    };

    

    useEffect(() => {
      loadUsers();
    }, [currentPage]);


    function loadUsers() {
      fetch(`api/users?page=${currentPage-1}`)
          .then(res => res.json())
          .then((result) => {
              setUsers(result.content);
              let items = [];
              for (let index = 1; index <= result.totalPages; index++) {
                  items.push(
                      <Pagination.Item key={index} active={currentPage === index} onClick={() => setCurrentPage(index)} >
                          {index}
                      </Pagination.Item>
                  );
                  setPageItems(items);
              }
          });
    }


    function clearForm() {
      setSelectedUser({
          tcKimlik: '',
          hastaneKimlik: '',
          ad: '',
          soyad: '',
          gender: '',
          role: ''
      });
    } 


    function isNotClear() {
      return (
          selectedUser.tcKimlik !== '' ||
          selectedUser.hastaneKimlik !== '' ||
          selectedUser.ad !== '' ||
          selectedUser.soyad !== '' ||
          selectedUser.gender !== '' ||
          selectedUser.role !== ''
      );
    }

  
    function handleInputChange(e) {
      const { name, value } = e.target;
      setSelectedUser({ ...selectedUser, [name]: value });
    }


    function saveUser() {
      fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          body: JSON.stringify(selectedUser)
      }).then((res) => res.json())
          .then((result) => {
              if (result.errorMessage) {
                  setErrorMessage(result.errorMessage);
              } else {
                  loadUsers();
                  clearForm();
                  setErrorMessage(null);
              }
        });
    }
    

    function deleteUser() {
      fetch(`/api/users/${selectedUser.id}`, {
          method: 'DELETE'
      }).then(() => {
          loadUsers();
          clearForm();
          handleClose();
      });
    }
  
    

    return (
    <Container style={{backgroundColor: '#0C134F', color: 'white', borderRadius: '30px'} }>
      <Row>
        <Col sm={8}>
              <br />
              <SearchBar value={searchQuery} onChange={handleSearchChange}/>
              <Table striped bordered hover>
                  <thead>
                      <tr>
                        <th>Tc Kimlik</th>
                        <th>Ad</th>
                        <th>Soyad</th>
                        <th>Cinsiyet</th>
                        <th>Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(filterUsers).map((user) => (
                        <tr key={user.id} onClick={() => { setSelectedUser(user) }}>
                          <td>{user.tcKimlik}</td>
                          <td>{user.ad}</td>
                          <td>{user.soyad}</td>
                          <td>{user.gender}</td>
                          <td>{user.role}</td>
                        </tr>
                      ))}
                    </tbody>
              </Table>
              <Pagination>{pageItems}</Pagination>
          </Col>      
          <Col sm={4}>
            <br />
              <h1 className='text-center' style={{fontFamily:'Post No Bills Jaffna', fontSize:'60px'}}>Hasta Kayıt</h1>
                  <Form>
                      {errorMessage ? (
                            <Alert key='danger' variant='danger'>
                                {errorMessage}
                            </Alert>
                        ) : ('')}  
                      <Form.Group>
                        <Form.Label>Rol:</Form.Label>
                        <Form.Select
                            aria-label="Lütfen rol belirtiniz"
                            name='role'
                            value={selectedUser.role}
                            onChange={(e) => handleInputChange(e)}
                        >
                            <option>SEÇİNİZ</option>
                            <option value='HASTA'>HASTA</option>
                            <option value='DOKTOR' disabled>DOKTOR</option>

                        </Form.Select>
                      </Form.Group>
                      <br />
                      <Form.Group>
                      <Form.Label>TC Kimlik Numarası:</Form.Label>
                      <Form.Control
                        type="text"
                        autoComplete='off'
                        name="tcKimlik"
                        maxLength= {'11'}
                        placeholder='TC Kimlik numarasını giriniz'
                        value={selectedUser.tcKimlik}
                        onChange={(e) => handleInputChange(e)}
                        className={selectedUser.role === 'DOKTOR' ? 'disabledRole' : ''}
                      />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>Ad:</Form.Label>
                      <Form.Control
                        type="text"
                        autoComplete='off'
                        name="ad"
                        maxLength={'22'}
                        placeholder='Ad'
                        value={selectedUser.ad}
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>Soyad:</Form.Label>
                      <Form.Control
                        type="text"
                        autoComplete='off'
                        name="soyad"
                        maxLength={'22'}
                        placeholder='Soyad'
                        value={selectedUser.soyad}
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>Cinsiyet</Form.Label>
                            <Form.Select
                            aria-label="Lütfen cinsiyet belirtiniz"
                            name='gender'
                            value={selectedUser.gender}
                            onChange={(e) => handleInputChange(e)}
                            >
                            <option>Cinsiyet seçiniz</option>
                            <option value='ERKEK'>ERKEK</option>
                            <option value='KADIN'>KADIN</option>
                        </Form.Select>
                    </Form.Group>
                    <br/>
                    <div className='text-center'>
                    <Button variant="primary" disabled={!isNotClear()} type="button" onClick={saveUser}>
                            {selectedUser.id ? (
                                'Güncelle'
                            ) : ('Kaydet')}
                        </Button>
                        {' '}
                        {isNotClear() ? (
                            <>
                                <Button variant="outline-primary" type="button" onClick={clearForm}>
                                    Temizle
                                </Button>{' '}
                                {selectedUser.id ? (<Button variant="danger" type="button" onClick={handleShow}>
                                    Sil
                                </Button>) : ('')}
                            </>

                        ) : ('')}
                    </div>
                    <br />
                </Form>
            </Col>
          </Row>
          <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sil</Modal.Title>
                </Modal.Header>
                <Modal.Body>Emin misiniz?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Kapat
                    </Button>
                    <Button variant='danger' onClick={deleteUser}> Sil</Button>
                </Modal.Footer>
            </Modal>
      </Container>
    );
  }
  export default Hasta;

