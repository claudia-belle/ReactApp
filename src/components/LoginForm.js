import React from 'react';
import {supabase} from '../supabase/Client';
import { Card, Form, Input, Button, message, PageHeader} from 'antd';
import { LoginOutlined } from '@ant-design/icons';

class LoginForm extends React.Component {

    async login(e){
        const { data, error } = await supabase.auth.signInWithPassword({
            email: e.email,
            password: e.password,
        })
        
        if(error != null){
            message.error({
                content: 'ERROR: Invalid login credentials.',
                style: { marginTop: '3em' },
            });
        }else {
            this.props.callBackOnFinishLoginForm({
                data: data.user,
            });
        }
    }

    render() {
        const routes = [
            { breadcrumbName: 'MyDelivery ReApp', },
            { breadcrumbName: 'Login', }
        ];
        return (
        <div>
        <PageHeader breadcrumb={{routes}} style={{ padding:'0 0 20px 0' }}/>
        <Card>
            <Form name="basic" labelCol={{span: 24/3}} wrapperCol={{sm: { span: 24/2}, md: { span: 24/3}}}
                initialValues={{remember: true,}}
                onFinish={ values => this.login(values) } autoComplete="off">

                <Form.Item label="Email" name="email"
                rules={[ 
                    { required: true,message: 'Please input your username!',},
                ]}>
                <Input placeholder='user@email.com' allowClear/>
                </Form.Item>

                <Form.Item label="Password" name="password"
                rules={[
                    { required: true, message: 'Please input your password!', },
                ]}>
                <Input.Password placeholder='******' allowClear/>
                </Form.Item>

                <Form.Item wrapperCol={{  xs: { offset: 0 }, sm: { offset: 8, span: 24/2 }, md: { offset: 8, span: 24/3 } }} >
                <Button type="primary" htmlType="submit" block><LoginOutlined/>Login</Button>
                </Form.Item>
            </Form>
        </Card>
        </div>
        )
    }
}

export default LoginForm;
