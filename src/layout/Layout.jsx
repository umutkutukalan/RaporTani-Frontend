import { hover } from "@testing-library/user-event/dist/hover";
import { Container, Navbar, Nav, NavLink } from "react-bootstrap";
import { Outlet } from "react-router-dom";


export default function Layout() {
    return <>
    <div style={{borderBottom: '1px solid black', backgroundColor:'#931A25',}}>
        <Navbar expand='lg'>
            <Container>
                <Navbar.Brand style={{color:'white', fontSize:'50px', fontFamily:'Post No Bills Jaffna', marginRight:'30px'}} href='/'> RaporTanı</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className='me-auto'>
                        <Nav.Link style={{color:'white',fontSize:'25px', fontFamily:'Post No Bills Jaffna', margin:'10px'}} href='/' >Hasta</Nav.Link>
                        <Nav.Link style={{color:'white',fontSize:'25px', fontFamily:'Post No Bills Jaffna', margin:'10px'}} href='/doktor' >Doktor</Nav.Link>
                        <Nav.Link style={{color:'white',fontSize:'25px', fontFamily:'Post No Bills Jaffna', margin:'10px'}} href='/kayıt' >Rapor</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
    <br />
    <Outlet />
    </>
}
