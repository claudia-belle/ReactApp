import React from 'react';
import {supabase} from '../supabase/Client';
import { Card, Descriptions, PageHeader } from 'antd';

class UserData extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            item : {}
        }
    }
    componentDidMount = async () => {
        this.getUserData();
    }

    getUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
        .from('client')
        .select('*')
        .eq('email', user.email);

        if ( error == null && data.length > 0){
            this.setState({
                item : data[0]
            }) 
        }
    }
    render() {
        const routes = [
            { breadcrumbName: 'MyDelivery ReApp', },
            { breadcrumbName: 'My Profile', }
        ];
        return (
            <div>
                <PageHeader breadcrumb={{routes}} style={{ padding:'0 0 20px 0' }}/>
                <Card>
                <Descriptions title='User Personal Data'>
                    <Descriptions.Item label="Name"><strong>{ this.state.item.name }</strong></Descriptions.Item>
                    <Descriptions.Item label="Surname"><strong>{ this.state.item.surname }</strong></Descriptions.Item>
                    <Descriptions.Item label="Email"><strong>{ this.state.item.email }</strong></Descriptions.Item>
                </Descriptions>
                </Card>
            </div>
        )
    }
}

export default UserData;