import SearchBar from './SearchBar';
import axios from 'axios';
import React, { Component, useState, useEffect } from 'react';
import { Container, Row, Col, Table, Pagination, Form, Button, Alert, Modal, ListGroup, FormGroup} from "react-bootstrap";

const PotantialHastaSearchBar = ({ value, onChange, placeholder }) => {
  return (
    <form>
      <div className="form-row mb-5">
        <div className="col-12">
          <input 
            type="text"
            value={value}
            onChange={onChange}
            className="form-control"
            placeholder={'Ara...'}
          />
        </div>
      </div>  
    </form>  
  );
};


const Rapor = () => {
    const [show, setShow] = useState(false);
    const [image, setImage] = useState(null);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [raporlar, setRaporlar] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageItems, setPageItems] = useState([]);
    const [doktorlar, setDoktorlar] = useState([]);
    const [raporHastalar, setRaporHastalar] = useState([]);
    const [selectedRapor, setSelectedRapor] = useState({
      taniBaslik: '',
      taniDetay: '',
      raporTarih: '',
      dosyaNumarasi: '',
      doktorId: 0,
      doktor: {},
      hastalar: []
    })
    const [searchQuery, setSearchQuery] = useState('');
    const [searchPotantial, setSearchPotantial] = useState('');

    // RAPOR SEARCHE
    const RaporSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    const filterRaporlar = (rapor) => {
      const fullName = `${rapor.doktor.ad} ${rapor.doktor.soyad}`.toLowerCase();
      const dosyaNumarasi = rapor.dosyaNumarasi.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) || dosyaNumarasi.includes(searchQuery.toLowerCase());
    };

    // POTANTİAL HASTA SEARCH
    const PotantialSearchChange = (e) => {
      setSearchPotantial(e.target.value);
    };

    const filterPotantial = (hasta) => {
      const fullName = `${hasta.ad} ${hasta.soyad}`.toLowerCase();
      return fullName.includes(searchPotantial.toLowerCase());
    }
    

    useEffect(() => {
      loadRaporlar();
      loadDoktorlar();
    }, [currentPage]);
  

    function loadRaporlar() {
      fetch(`/api/rapor?page=${currentPage-1}`)
          .then(res => res.json())
          .then((result) => {
              setRaporlar(result.content);
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


    function loadDoktorlar() {
      fetch(`/api/doktors/by-role?role=DOKTOR`)
          .then(res => res.json())
          .then((result) => {
              setDoktorlar(result);
          });
    }

    function loadRaporHastalar(rapor) {
      fetch('/api/users/potential-hasta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          body: JSON.stringify(rapor.hastalar.map((st) => st.id))
      }).then((res) => res.json())
          .then((result) => {
              console.log(result);
              setRaporHastalar(result);
          });
    }


    function handleInputChange(e) {
      const { name, value } = e.target;
      setSelectedRapor({ ...selectedRapor, [name]: value });
      setRaporHastalar([]);
    }
  

    const handleImageChange = (event) => {
       setImage(event.target.files[0]);
     };
  
     const handleSubmit = async (event) => {
       event.preventDefault();
  
       try {
         const formData = new FormData();
         formData.append('image', image);
  
         await axios.post('/api/rapor', formData, {
           headers: {
             'Content-Type': 'multipart/form-data',
           },
         });
  
         console.log('Resim başarıyla yüklendi.');
       } catch (error) {
         console.error('Resim yükleme hatası:', error);
       }
    };
    

    function createRapor() {
      const rapor = {
          dosyaNumarasi: selectedRapor.dosyaNumarasi,
          taniBaslik: selectedRapor.taniBaslik,
          taniDetay: selectedRapor.taniDetay,
          raporTarih: selectedRapor.raporTarih,
          doktor: {
            id: Number(selectedRapor.doktorId)
          },
      }
      fetch('/api/rapor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(rapor)
        }).then((res) => res.json())
            .then((result) => {
                loadRaporlar();
                clearForm();
            });
    }


    function saveRapor() {
      fetch('/api/rapor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          body: JSON.stringify(selectedRapor)
      }).then((res) => res.json())
          .then((result) => {
              if (result.errorMessage) {
                  setErrorMessage(result.errorMessage);
              } else {
                  loadRaporlar();
                  clearForm();
                  setErrorMessage(null);
              }
          });
      }


      function deleteRapor() {
        fetch(`/api/rapor/${selectedRapor.id}`, {
            method: 'DELETE'
        }).then(() => {
            loadRaporlar();
            clearForm();
            handleClose();
        });
      }  


    function setRapor(rapor) {
      if (rapor.id === selectedRapor.id) {
          clearForm();
      } else {
          rapor.doktorId = rapor.doktor.id;
          setSelectedRapor(rapor);
          loadRaporHastalar(rapor)
      }
    }
  

    function clearForm() {
      setSelectedRapor({
          taniBaslik: '',
          taniDetay: '',
          raporTarih: '',
          dosyaNumarasi: '',
          doktorId: 0,
          doktor: {},
          hastalar: []
      });
      setRaporHastalar([]);
    }
    

    function addHasta(hasta) {
      selectedRapor.hastalar.push(hasta);

      fetch('/api/rapor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          body: JSON.stringify(selectedRapor)
      }).then((res) => res.json())
          .then((result) => {
              loadRaporlar();
              clearForm();
          });
    }



    function removeHasta(hastaId) {
        selectedRapor.hastalar = selectedRapor.hastalar.filter(
            (hasta) => hasta.id !== hastaId
        );

        fetch('/api/rapor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(selectedRapor)
        }).then((res) => res.json())
            .then((result) => {
                loadRaporlar();
                clearForm();
            });

    }


    function isNotClear() {
      return (
          selectedRapor.doktor !== '' &&
          selectedRapor.dosyaNumarasi !== '' &&
          selectedRapor.taniBaslik !== '' &&
          selectedRapor.taniBaslik !== '' &&
          selectedRapor.raporTarih !== '' 
      );
    }


    

    return (
      <Container style={{backgroundColor: '#0C134F', color: 'white', borderRadius: '30px'} }>
            <Row>
              <Col sm={8}>
                  <br />
                  <SearchBar value={searchQuery} onChange={RaporSearchChange}/>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Doktor</th>
                                <th>Dosya Numarası</th>
                                <th>Tanı Başlığı</th>
                                <th>Tanı Detayı</th>
                                <th>Rapor Tarihi</th>
                            </tr>
                        </thead>
                        <tbody>
                        {raporlar.filter(filterRaporlar).map((rap) => (
                            <>
                              <tr
                                  key={rap.id}
                                  onClick={() => {
                                      setRapor(rap);
                                    }}
                                    >
                                    <td>{rap.id}</td>
                                    <td>{rap.doktor.ad + ' ' + rap.doktor.soyad}</td>
                                    <td>{rap.dosyaNumarasi}</td>
                                    <td>{rap.taniBaslik}</td>
                                    <td>{rap.taniDetay}</td>
                                    <td>{rap.raporTarih}</td>
                              </tr>
                                  {selectedRapor.id && rap.id === selectedRapor.id
                                    ? selectedRapor.hastalar.map((hasta) => (
                                    <tr key={hasta.tcKimlik}>
                                    <td></td>
                                    <td>{hasta.tcKimlik}</td>
                                    <td>{hasta.ad + ' ' + hasta.soyad}</td>
                                    <td>
                                    <Button size="sm" variant="danger" onClick={() => { removeHasta(hasta.id) }}>
                                        Remove
                                    </Button>
                                    </td>
                              </tr>
                              )) : ''}
                            </>
                        ))}
                        </tbody>
                    </Table>
                    <Pagination>{pageItems}</Pagination>
              </Col>
              <Col sm={4}>
                <br />
                  <h1 className='text-center' style={{fontFamily:'Post No Bills Jaffna', fontSize:'60px'}}>Rapor Oluştur</h1>
                      <Form>
                        <Form.Group controlId='doktorId'>
                          <Form.Label>Doktor</Form.Label>
                            <Form.Select
                                aria-label="Raporu Tutan Doktor"
                                name="doktorId"
                                value={Number(selectedRapor.doktorId)}
                                onChange={(e) => handleInputChange(e)}
                            >
                                <option>Raporu Tutan Doktor</option>
                                {doktorlar.map((doktor) => (
                                    <option value={doktor.id} key={doktor.id}>
                                        {doktor.ad + ' ' + doktor.soyad}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <br />
                        <Form.Group>
                          <Form.Label>Dosya Numarası:</Form.Label>
                          <Form.Control
                            type="text"
                            name="dosyaNumarasi"
                            autoComplete='off'
                            maxLength={'11'}
                            value={selectedRapor.dosyaNumarasi}
                            onChange={(e) => handleInputChange(e)}
                          />
                        </Form.Group>
                        <br />
                        <Form.Group>
                          <Form.Label>Tanı Başlığı:</Form.Label>
                          <Form.Control
                            type="text"
                            name="taniBaslik"
                            autoComplete='off'
                            value={selectedRapor.taniBaslik}
                            onChange={(e) => handleInputChange(e)}
                          />
                        </Form.Group>
                        <br />
                        <Form.Group className='mb-3'>
                          <Form.Label>Tanı Detayları:</Form.Label>
                          <Form.Control
                            type="text"
                            name="taniDetay"
                            autoComplete='off'
                            value={selectedRapor.taniDetay}
                            onChange={(e) => handleInputChange(e)}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Rapor Verilen Tarih:</Form.Label>
                          <Form.Control
                            type="date"
                            name="raporTarih"
                            value={selectedRapor.raporTarih}
                            onChange={(e) => handleInputChange(e)}
                          />
                        </Form.Group>
                        <br/>
                        <FormGroup onChange={handleSubmit}>
                          <Form.Label>Rapor Belgesi:</Form.Label>
                          <input type='file' name="image" accept="image/png, image/jpeg" onChange={handleImageChange} />
                        </FormGroup>
                        <br />
                        <div className='text-center'>
                            {selectedRapor.id ? (<Button variant='primary' type='button' onClick={saveRapor}>
                                Update
                            </Button>) : (<Button variant='primary' type='button' onClick={createRapor}> Create </Button>)}
                            {isNotClear() ? (
                            <>
                                <Button variant="outline-primary" type="button" onClick={clearForm}>
                                    Clear
                                </Button>{' '}
                                {selectedRapor.id ? (<Button variant="danger" type="button" onClick={handleShow}>
                                    Delete
                                </Button>) : ('')}
                            </>
                        ) : ('')}
                        </div>
                        <br/>
                        <br/>
                  </Form>
                  <PotantialHastaSearchBar value={searchPotantial} onChange={PotantialSearchChange}/>
                  <ListGroup as='ol' numbered>
                        {raporHastalar.filter(filterPotantial).map((hasta) => (
                            <ListGroup.Item as='li' className="d-flex justify-content-between align-items-start" key={hasta.id}>
                                <div className="ms-2 me-auto">
                                    {hasta.ad} {hasta.soyad}
                                </div>
                                <Button variant="outline-primary" size='sm' onClick={() => addHasta(hasta)}>
                                    Add
                                </Button>
                            </ListGroup.Item>
                        ))}
                  </ListGroup>
                  <br />
              </Col>
            </Row>  
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Emin misiniz?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant='danger' onClick={deleteRapor}> Delete</Button>
                </Modal.Footer>
            </Modal>
      </Container>
    );
  };
export default Rapor;
