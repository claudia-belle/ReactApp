import React from 'react';
import {supabase} from '../supabase/Client';
import { Button, message, Table, Tag, Rate, PageHeader, Popconfirm, Empty} from 'antd';
import { DeleteOutlined, CheckCircleOutlined, FolderOpenFilled, HomeFilled} from '@ant-design/icons';

class MyDeliveriesTable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            deliveries : [],
            user: 'unknown',
            selectedRowDel: [],
            selectedRowComplete: [],
        }
    }

    componentDidMount = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user != null) {
            this.setState({
                user: user,
            })
        }
        this.getDeliveriesSummary();
    }

    completeDelivery = async (packId) => {
        const { error } = await supabase
            .from('service')
            .update({status: 'done' })
            .eq('package', packId);
        
        if(error == null) {
            message.success({
                content: 'The delivery was completed!',
                style: { marginTop: '3em' },
            })
            this.setState({selectedRowComplete: [],});
            this.getDeliveriesSummary();
        } else {
            message.error({
                content: 'ERROR: Internal error. Try again later.',
                style: { marginTop: '3em' },
            });
        }
    }

    deleteDelivery = async (packId) => {

        const { error1 } = await supabase
            .from('service')
            .delete()
            .eq('package', packId);

        const { error2 } = await supabase
            .from('delivery')
            .delete()
            .eq('id', packId);

        if(error1 == null && error2 == null) {
            message.success({
                content: 'The delivery was deleted',
                style: { marginTop: '3em' },
            })
            this.setState({selectedRowDel: [],});
            this.getDeliveriesSummary();
        } else {
            message.error({
                content: 'ERROR: Internal error. Try again later.',
                style: { marginTop: '3em' },
            });
        }
        
    }

    getDeliveriesSummary = async () => {
    
        const { data, error } = await supabase
        .from('delivery')
        .select('*, service(deliveryman,status)');

        if ( error == null){
            this.setState({
                deliveries : data
            }) 
        }
    }

    render() {

        let columns1 = [
        { 
            title: 'From',
            dataIndex: 'from',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.from < b.from,
            render: from => {if (from.length>10) return from.substr(0,10)+'...'; else return from;},
        },
        { 
            title: 'To',
            dataIndex: 'to',
            sorter: (a, b) => a.to < b.to,
            render: to => {if (to.length>10) return to.substr(0,10)+'...'; else return to;},
        },
        { 
            title: 'When',
            dataIndex: 'when',
            render: when => new Date(when).toLocaleDateString(),
        },
        { 
            title: 'Price',
            dataIndex: 'price',
            align: 'right',
            sorter: (a, b) => a.price - b.price,
            render: price => price+' €',
        },
        { 
            title: 'Size',
            dataIndex: 'size',
        },
        { 
            title: 'Weight',
            dataIndex: 'weight',
            align: 'right',
            render: weight => weight+' kgs',
        },
        { 
            title: 'Fragile',
            dataIndex: 'fragile',
            align: 'center',
            render: fragile => { 
                if (fragile==true){
                    return <Tag color={'gold'}>FRAGILE</Tag>
                }
            },
        },
        { 
            title: 'Status',
            dataIndex: 'service',
            filters: [
            {
                text: 'Active',
                value: 'active',
            },
            {
                text: 'Pending',
                value: 'pending',
            },
            {
                text: 'Done',
                value: 'done',
            },
            ],
            onFilter: (value, record) => record.service[0].status.indexOf(value) === 0,
            render: service => {
                if(service) {
                    if (service.length > 0){
                        if(service[0].status === 'active') {
                            return <Tag color={'geekblue'}>{service[0].status}</Tag>;
                        }else if(service[0].status === 'pending') {
                            return <Tag color={'magenta'}>{service[0].status}</Tag>;
                        }else{
                            return <div><Tag color={'lime'}>{service[0].status}</Tag><Rate/></div>;
                        }
                    }
                }
            },
        },
        { 
            title: 'Actions',
            dataIndex: 'id',
            render: id =>
                <Popconfirm title="Delete?" okText="Yes" cancelText="No"
                    onConfirm={() => this.deleteDelivery(id)}>
                    <Button type="link"><DeleteOutlined />Delete</Button>
                </Popconfirm>,
        },
        ]

        let columns2 = [
            { 
                title: 'From',
                dataIndex: 'from',
                sorter: (a, b) => a.from < b.from,
                render: from =>  {if (from.length>10) return from.substr(0,10)+'...'; else return from;}
            },{ 
                title: 'PC',
                dataIndex: 'fromPC',
                align: 'right',
            },
            { 
                title: 'To',
                dataIndex: 'to',
                sorter: (a, b) => a.to < b.to,
                render: to =>  {if (to.length>10) return to.substr(0,10)+'...'; else return to;}
            },
            { 
                title: 'PC',
                dataIndex: 'toPC',
                align: 'right',
            },
            { 
                title: 'Client',
                dataIndex: 'sender',
            },
            { 
                title: 'Limited Date',
                dataIndex: 'when',
                render: when => new Date(when).toLocaleDateString(),
            },
            { 
                title: 'Benefits',
                dataIndex: 'price',
                align: 'right',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.price - b.price,
                render: price => price+' €',
            },
            { 
                title: 'Size',
                dataIndex: 'size',
            },
            { 
                title: 'Weight',
                dataIndex: 'weight',
                align: 'right',
                render: weight => weight+' kgs',
            },
            { 
                title: 'Fragile',
                dataIndex: 'fragile',
                align: 'center',
                render: fragile => { 
                    if (fragile==true){
                        return <Tag color={'gold'}>FRAGILE</Tag>
                    }
                },
            },
            { 
                title: 'Status',
                dataIndex: 'service',
                filters: [
                    {
                        text: 'Pending',
                        value: 'pending',
                    },
                    {
                        text: 'Done',
                        value: 'done',
                    },
                    ],
                    onFilter: (value, record) => record.service[0].status.indexOf(value) === 0,
                render: service => {
                    if (service.length > 0){
                        if(service[0].status == 'pending') {
                            return <Tag color={'magenta'}>{service[0].status}</Tag>
                        }else{
                            return <Tag color={'lime'}>{service[0].status}</Tag>
                        }
                    }
                },
            },
            { 
                title: 'Actions',
                dataIndex: 'id',
                render: id =>
                    <Button type="link" onClick={() => this.completeDelivery(id)}><CheckCircleOutlined />Complete</Button>,
            },
            ]

        let deliveries = this.state.deliveries.map( element => {
            element.key = element.id;
            return element;
        });

        let mydeliveries = deliveries.filter( element => {
            if(element.sender == this.state.user.email){
                return element;
            }
        } );

        let services = deliveries.filter( element => {
            if(element.service[0].deliveryman == this.state.user.email){
                return element;
            }
        } );


        const routes = [
            { breadcrumbName: 'MyDelivery ReApp', },
            { breadcrumbName: 'My Deliveries', }
        ];

        const elementsPagination = (total, range) => {
            let info = range[0] +'-'+ range[1] +' of '+ total +' deliveries';
            return info;
        }
        
        //Select Option -Delete
        const onSelectDelChange = (newSelectedRowDel) => {
            this.setState({
                selectedRowDel: newSelectedRowDel,
            });
        };
        const rowSelectionDel = {
            selectedRowKeys: this.state.selectedRowDel,
            onChange: onSelectDelChange,
        };
        const hasSelectedDel = this.state.selectedRowDel.length > 0;

        //Select Option -Complete
        const onSelectCompleteChange = (newSelectedRow) => {
            this.setState({
                selectedRowComplete: newSelectedRow,
            });
        };
        const rowSelectionComplete = {
            selectedRowKeys: this.state.selectedRowComplete,
            onChange: onSelectCompleteChange,
        };
        const hasSelectedComplete = this.state.selectedRowComplete.length > 0;


        return (
            <div>
                <PageHeader breadcrumb={{routes}} style={{ padding:'0 0 20px 0' }}/>
                <h3><HomeFilled /> My orders</h3>
                <Popconfirm title="Delete the selection?"
                placement='topLeft'
                okText="Yes" cancelText="No" disabled={!hasSelectedDel}
                onConfirm={() => this.state.selectedRowDel.forEach(element => this.deleteDelivery(element))}>
                    <Button type="primary" disabled={!hasSelectedDel} style={{margin:'1em 0'}}>
                        <DeleteOutlined />Delete
                    </Button>
                </Popconfirm>
                <span style={{ marginLeft: 8 }}>
                    {hasSelectedDel ? `Selected ${this.state.selectedRowDel.length} deliveries` : ''}
                </span>
                <Table columns={columns1} dataSource={mydeliveries} scroll={{x:1000}}
                rowSelection={rowSelectionDel}
                pagination={{
                    pageSize: 4,
                    hideOnSinglePage: true,
                    showTotal: elementsPagination,
                    size: 'small',
                }}/>
                
                <h3 style={{marginTop:'3em'}}><FolderOpenFilled /> My services</h3>
                <Button type="primary" disabled={!hasSelectedComplete} style={{margin:'1em 0'}}
                onClick={() => this.state.selectedRowComplete.forEach(element => this.completeDelivery(element))} >
                        <CheckCircleOutlined />Complete
                    </Button>
                <span style={{ marginLeft: 8 }}>
                    {hasSelectedComplete ? `Selected ${this.state.selectedRowComplete.length} deliveries` : ''}
                </span>
                <Table rowSelection={rowSelectionComplete} columns={columns2} dataSource={services} scroll={{x:1000}}
                pagination={{
                    pageSize: 4,
                    hideOnSinglePage: true,
                    showTotal: elementsPagination,
                    size: 'small',
                }}/>
            </div>
        )

    }
}


export default MyDeliveriesTable;