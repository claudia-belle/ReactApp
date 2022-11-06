import React from 'react';
import { supabase } from '../supabase/Client';
import withRouter from '../withRouter';
import moment from 'moment';
import { Card, Form, Input, InputNumber, Slider, Button, message, DatePicker, Switch, Radio, Space, PageHeader } from 'antd';
import { SaveOutlined, ClearOutlined } from '@ant-design/icons';

class NewDeliveryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user : null
        };
        this.existUser();
    }
    
    async existUser() {
        if ( this.state.user == null){
            const { data: { user } } = await supabase.auth.getUser();
            if ( user == null ){
                //Requiere autenticación
                this.props.navigate("/login");
            }
        }
    }

    componentDidMount = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user != null) {
            this.setState({
                user: user,
            })
        }
    }

    formRef = React.createRef();
    onReset = () => {
        this.formRef.current.resetFields();
    };
    
    async newDelivery(e){

        try {
            const {data} = await supabase
            .from('delivery')
            .insert({ 
                from: e.from,
                fromPC: e.fromPC,
                to: e.to,
                toPC: e.toPC,
                when: e.when,
                size: e.size,
                weight: e.weight,
                price: e.price,
                fragile: e.fragile,
                sender: this.state.user.email,
            })
            .select();

            const newPack = JSON.parse(JSON.stringify(data));

            await supabase
            .from('service')
            .insert({
                package: newPack[0].id,
            });
            
            message.success({
                content: 'The new order has been successfully saved!',
                style: { marginTop: '3em' },
            });

            this.props.navigate('/myDeliveries');
        } catch (error) {
            message.error({
                content: 'ERROR: Something went wrong. '+ error,
                style: { marginTop: '3em' },
            });
        }
    }

    render() {
        // Cannot select days before today
        const disabledDate = (current) => {
            return current < moment();
        };

        const routes = [
            { breadcrumbName: 'MyDelivery ReApp', },
            { breadcrumbName: 'New Delivery', }
        ]
        return (
        <div>
            <PageHeader breadcrumb={{routes}} style={{margin:'0px 0px 8px', padding:0}}/>
            <Card style={{marginTop:'1em'}}>
            <Form name="basic" ref={this.formRef} labelCol={{span: 24/3}} wrapperCol={{sm: { span: 24/2}, md: { span: 24/3}}}
                initialValues={{remember: true,}}
                onFinish={ values => this.newDelivery(values) } autoComplete="off">
                <Form.Item label="From" style={{marginBottom:0}} required={true}>
                    <Form.Item name="from"
                        rules={[ 
                            { required: true,message: 'Please input the origin address!',},
                        ]}
                        style={{
                            display: 'inline-block',
                            width: 'calc(60% - 15px)',
                        }}>
                        <Input placeholder="Oviedo, Asturias" allowClear/>
                    </Form.Item>
                    <Form.Item label="Postal Code" name="fromPC"
                        rules={[ 
                            { required: true, message:'Complete!'},
                        ]}
                        style={{
                            display: 'inline-block',
                            width: 'calc(40% - 15px)',
                            marginLeft: '15px '
                        }}>
                        <InputNumber min={1} placeholder="1234"/>
                    </Form.Item>
                </Form.Item>

                <Form.Item label="To" style={{marginBottom:0}} required={true}>
                    <Form.Item name="to"
                        rules={[ 
                            { required: true,message: 'Please input the destiny address!',},
                        ]}
                        style={{
                            display: 'inline-block',
                            width: 'calc(60% - 15px)',
                        }}>
                        <Input placeholder="Gijón, Asturias" allowClear/>
                    </Form.Item>
                    <Form.Item label="Postal Code" name="toPC"
                        rules={[ 
                            { required: true, message:'Complete!'},
                        ]}
                        style={{
                            display: 'inline-block',
                            width: 'calc(40% - 15px)',
                            marginLeft: '15px '
                        }}>
                        <InputNumber min={1} placeholder="4321"/>
                    </Form.Item>
                </Form.Item>

                <Form.Item label="When" name="when"
                tooltip='Select the day you want your package to be delivered'
                rules={[
                    { required: true,message: 'Please input the delivery date!',},
                ]}>
                    <DatePicker format={'DD/MM/YYYY'} disabledDate={disabledDate}/>
                </Form.Item>

                <Form.Item label="Size" name="size"
                tooltip="Indicative measures: -Small: 24x17cm -Medium: 32x22cm -Large: 39x28cm"
                rules={[
                    { required: true,message: 'Please select the size of your package!',},
                ]}>
                    <Radio.Group>
                        <Radio value="small"> Small </Radio>
                        <Radio value="medium"> Medium </Radio>
                        <Radio value="large"> Large </Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="Weight">
                    <Form.Item name="weight" noStyle>
                    <InputNumber min={1} max={50} value={0} placeholder="3"/>
                    </Form.Item>
                    <span className="ant-form-text"> kgs</span>
                </Form.Item>


                <Form.Item label="Price (€)" name="price"
                rules={[
                    { required: true,message: 'Please input the price!',},
                ]}>
                    <Slider marks={{
                        1: '1',
                        20: '20',
                        40: '40',
                        60: '60',
                        80: '80',
                        100: '100+',
                    }}
                    />
                </Form.Item>

                <Form.Item label="Fragile" name="fragile" tooltip="Check if the package is fragile" valuePropName="checked">
                    <Switch defaultChecked/>
                </Form.Item>

                <Form.Item wrapperCol={{  xs: { offset: 0 }, sm: { offset: 8, span: 6 }, md: { offset: 8, span: 2 } }} >
                    <Space>
                    <Button type="primary" htmlType="submit" block><SaveOutlined />Save</Button>
                    <Button type="link" htmlType="button" onClick={this.onReset}><ClearOutlined />Reset</Button>
                    </Space>
                </Form.Item>
            </Form>
            </Card>
        </div>
        )
    }
}

export default withRouter(NewDeliveryForm);
