import React from 'react';
import {supabase} from './supabase/Client';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import NewDeliveryForm from './components/NewDeliveryForm';
import DeliveriesList from './components/DeliveriesList';
import MyDeliveriesTable from './components/MyDeliveriesTable';
import UserData from './components/UserData';
import NotFound from './components/NotFound';
import withRouter from './withRouter';
import { Route, Routes, Link, Navigate } from "react-router-dom"
import { Layout, Menu, Col, Row, Avatar, Image, Button, message} from 'antd';
import { RocketOutlined, LoginOutlined, LogoutOutlined, PlusCircleOutlined, UserAddOutlined} from '@ant-design/icons';

class App extends React.Component {
    
    constructor(props) {
        super(props);
        // Configuración Inicial del estado -> usuario
        this.state = {
            user : null
        };
    }

    protectedRoute = (element) => {
        if (this.state.user == null) {
            return <Navigate to={"/"} replace />;
        }
        return element;
    };
    
    componentDidMount = async () => {
        if ( this.state.user == null){
            const { data: { user } } = await supabase.auth.getUser();
            if ( user != null ){
                this.setState({
                    user : user
                });
                this.props.navigate("/");
            }else {
                this.props.navigate("/login");
            }
        }
    }

    callBackOnFinishSignupForm = (newUser) => {
        if ( newUser.data != null ){
            this.setState({
                user: newUser.data
            });

            this.props.navigate("/myDeliveries");
        }
    }

    callBackOnFinishLoginForm = (loginUser) => {
        if ( loginUser.data != null ){
            this.setState({
                user: loginUser.data
            });

            this.props.navigate("/myDeliveries");
        }
    }

    loggingOut = () => {
        const key = 'logout';
        let logout = 1;
        message.loading({
            content: 'Logging out...  CLICK TO UNDO!',
            key: key,
            onClick: () => {logout=0;return},
        });

        setTimeout(async() => {
            if(logout) {
                const { error } = await supabase.auth.signOut();
                if(error == null){
                    this.setState({
                        user: null
                    })
                    message.success({content: 'Logged out!', key: key, duration:2});
                    this.props.navigate('/login');
                } else {
                    message.warning({content: 'Something went wrong. Try again.', key: key});
                }
            } else {
                message.info({content: 'Logging out process was cancelled', key: key, duration: 2});
            }
        }, 3000);
    }
    
    render() {
        const { Header, Footer, Content } = Layout;

        let userItems = [
            { key:"menuLogin",  label: <Link to="/login">Login</Link>, icon: <LoginOutlined/>},
            { key:"menuSignup",  label: <Link to="/signup">Signup</Link>, icon: <UserAddOutlined />},
        ]
        if ( this.state.user != null ){
            userItems = [
                { key:"menuUser",
                label: <Link to="/profile"><Avatar style={{backgroundColor:"#015D52",color:"#ffffff"}}>
                    { this.state.user.email.charAt(0) }</Avatar></Link>},
                { key:"menuLogout",  label: <Button type='text' onClick={this.loggingOut} style={{color: 'rgba(255, 255, 255, 0.65)'}}>Logout</Button>, icon: <LogoutOutlined/>}
            ]
        }

        let menuItems = [
            { key:"menuDeliveries",  label: <Link to="/">Deliveries</Link>, icon: <RocketOutlined />},
            { key:"auth_myDeliveries",  label: <Link to="/myDeliveries">My deliveries</Link>, icon: <RocketOutlined /> },
            { key:"menuNewDelivery",  label: <Link to="/delivery/add">New delivery</Link>, icon: <PlusCircleOutlined /> },
        ]
        if (this.state.user == null){
            menuItems = menuItems.filter( element => !element.key.startsWith("auth") );
        }
        
        return (
            <Layout className="layout">
            <Header style={{height:"auto",padding:"0 100px"}}>
                <Row>
                    <Image width={70} src="delivery.png" preview={false}/>
                    <Col xs={12} sm={12} md={15} lg={18} xl={18}>
                        <Menu theme="dark" mode="horizontal" items={menuItems}></Menu>
                    </Col>
                    <Col xs={3} sm={3} md={4} lg={3} xl={3} style={{display: 'flex', flexDirection: 'row-reverse'}}>
                        <Menu theme="dark" mode="horizontal" items={userItems}></Menu>
                    </Col>
                </Row>
            </Header>
            <Content style={{ padding: '0 100px' }}>
                <div className="site-layout-content">
                <Row style={{ marginTop: 34 }}>
                    <Col span={24}>
                    <Routes>
                        <Route path='/' element={<DeliveriesList />}/>
                        <Route path="/myDeliveries" element={ this.protectedRoute(<MyDeliveriesTable />)} />
                        <Route path="/delivery/add" element={ <NewDeliveryForm />} />
                        <Route path="/profile" element={ this.protectedRoute(<UserData />)} />
                        <Route path="/login" element={ 
                            <LoginForm callBackOnFinishLoginForm  = { this.callBackOnFinishLoginForm } /> } />
                        <Route path="/signup" element={ 
                            <SignupForm callBackOnFinishSignupForm  = { this.callBackOnFinishSignupForm } /> } />
                        <Route path='*' element={<NotFound />}/>
                    </Routes>
                    </Col>
                </Row>
                </div>
            </Content>

            <Footer style={{ textAlign: 'center' }}> &copy; MyDelivery ReApp 2022</Footer>
            </Layout>
        );
    }
}

export default withRouter(App);