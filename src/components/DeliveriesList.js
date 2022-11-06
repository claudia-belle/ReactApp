import React, { useState } from 'react';
import {supabase} from '../supabase/Client';
import { Button, message, Table, Tag, PageHeader} from 'antd';
import { FolderOpenFilled } from '@ant-design/icons';


class DeliveriesList extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            deliveries : [],
            user: null,
            selectedRowKeys: [],
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

    assignDelivery = async (packId) => {
        
        if (this.state.user != null){
            const { error } = await supabase
                .from('service')
                .update({deliveryman: this.state.user.email, status: 'pending' })
                .eq('package', packId);
            
            if(error == null) {
                message.success({
                    content: 'The delivery was added to your services',
                    //style: { marginTop: '3em' },
                });

                this.setState({selectedRowKeys: [],});
                this.getDeliveriesSummary();
            } else {
                message.error({
                    content: 'ERROR: Internal error. Try again later.',
                    style: { marginTop: '3em' },
                });
            }
        } else {
            this.props.navigate("/login");
        }
    }

    getDeliveriesSummary = async () => {
        
        const { data, error } = await supabase
        .from('delivery')
        .select('*, service(status)');

        if ( error == null){
            this.setState({
                deliveries : data
            }) 
        }
    }

    render() {
        let columns = [
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
            title: 'Benefits',
            dataIndex: 'price',
            align: 'right',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '+ 5€',
                    value: '5',
                },
                {
                    text: '+ 10€',
                    value: '10',
                },
                {
                    text: '+ 20€',
                    value: '20',
                },
                {
                    text: '+ 40€',
                    value: '40',
                },
                {
                    text: '+ 60€',
                    value: '60',
                },
                ],
                onFilter: (value, record) => record.price > value,
            render: price => price+' €',
        },
        { 
            title: 'Size',
            dataIndex: 'size',
            filters: [
                {
                    text: 'Small',
                    value: 'small',
                },
                {
                    text: 'Medium',
                    value: 'medium',
                },
                {
                    text: 'Large',
                    value: 'large',
                },
                ],
                onFilter: (value, record) => record.size.indexOf(value) === 0,
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
            title: 'Actions',
            dataIndex: 'id',
            render: id =>
                <Button type="link" onClick={() => this.assignDelivery(id)} ><FolderOpenFilled />Assign delivery</Button>,
        },
        ]

        let data = this.state.deliveries.map( element => {
            element.key = element.id;
            return element;
        })
        data = data.filter( element => {
            if(element.service[0].status == 'active'){
                return element;
            }
        } );
        
        const routes = [
            { breadcrumbName: 'MyDelivery ReApp', },
            { breadcrumbName: 'Available Deliveries', }
        ];

        //Pagination
        const elementsPagination = (total, range) => {
            let info = range[0] +'-'+ range[1] +' of '+ total +' deliveries';
            return info;
        }

        //Select Option
        const onSelectChange = (newSelectedRowKeys) => {
            this.setState({
                selectedRowKeys: newSelectedRowKeys,
            });
        };
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: onSelectChange,
        };
        const hasSelected = this.state.selectedRowKeys.length > 0;
        
        return (
            <div>
                <PageHeader breadcrumb={{routes}} style={{ padding:'0 0 20px 0' }}/>
                <Button type="primary" disabled={!hasSelected} style={{margin:'1em 0'}}
                onClick={() => {
                    this.state.selectedRowKeys.forEach(element => this.assignDelivery(element));
                }}>
                    <FolderOpenFilled />Assign
                </Button>
                <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `Selected ${this.state.selectedRowKeys.length} deliveries` : ''}
                </span>
                <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{x:1000}}
                pagination={{
                    pageSize: 6,
                    //hideOnSinglePage: true,
                    showTotal: elementsPagination,
                    size: 'small',
                }}/>
                
            </div>
        )

    }
}


export default DeliveriesList;