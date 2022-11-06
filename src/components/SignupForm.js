import React from 'react';
import {supabase} from '../supabase/Client';
import { Card, Form, Input, InputNumber, Button, message, PageHeader} from 'antd';
import { UserAddOutlined} from '@ant-design/icons';


class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {errorUser: null};
    }

    async newUser(e){
        
        //Auth user
        const { data, error } = await supabase.auth.signUp({
            email: e.email,
            password: e.password,
        })
        if (error == null) {
            //New user
            try {
                await supabase
                .from('client')
                .insert({ 
                    name: e.name,
                    surname: e.surname,
                    phone: e.phone,
                    email: e.email,
                    password : e.password,
                });
            } catch (error) {
                message.error({
                    content: 'ERROR: Something went wrong. '+ error,
                    style: { marginTop: '3em' },
                });
            }
            
            this.props.callBackOnFinishSignupForm({
                data: data.user
            });
        } else {
            message.warning({
                content: 'WARNING: Something went wrong. Try again.',
                style: { marginTop: '3em' },
            });
        }       
    }

    render() {
        const routes = [
            { breadcrumbName: 'MyDelivery ReApp', },
            { breadcrumbName: 'Signup', }
        ];
        return (
        <div>
            <PageHeader breadcrumb={{routes}} style={{ padding:'0 0 20px 0' }}/>
            <Card>
            <Form name="basic" labelCol={{span: 24/3}} wrapperCol={{sm: { span: 24/2}, md: { span: 24/3}}}
                initialValues={{remember: true,}}
                onFinish={ values => this.newUser(values) } autoComplete="off">
                
                <Form.Item label="Name" name="name"
                rules={[ 
                    { required: true,message: 'Please input your name!',},
                ]}>
                <Input placeholder="Your Name" allowClear/>
                </Form.Item>

                <Form.Item label="Surname" name="surname">
                <Input placeholder="Your Surname" allowClear/>
                </Form.Item>

                <Form.Item label="Phone" name="phone">
                <InputNumber min={1} style={{ width: '100%' }} placeholder="600600600"/>
                </Form.Item>

                <Form.Item label="E-mail" name="email"
                rules={[
                    { type: 'email', message: 'The input is not valid E-mail!'},
                    { required: true,message: 'Please input your E-mail!',},
                ]}>
                <Input placeholder='user@email.com' allowClear/>
                </Form.Item>

                <Form.Item label="Password" name="password"
                hasFeedback rules={[
                    { required: true, message: 'Please input your password!', },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if(getFieldValue('password')){
                                if (getFieldValue('password').length >= 6) {
                                    return Promise.resolve();
                                }
                            }
                            return Promise.reject(new Error('The password is too short (min. 6 characters)!'));
                        },
                    }),
                ]}>
                <Input.Password placeholder='******'/>
                </Form.Item>

                <Form.Item wrapperCol={{  xs: { offset: 0 }, sm: { offset: 8, span: 24/2 }, md: { offset: 8, span: 24/3 } }} >
                <Button type="primary" htmlType="submit" block><UserAddOutlined /> Signup</Button>
                </Form.Item>
            </Form>
            
            </Card>
        </div>
        )
    }
}

export default SignupForm;
