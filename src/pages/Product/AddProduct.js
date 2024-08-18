import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { red } from '../../constants/colors';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const navigate = useNavigate();

    const handleSave = async (values) => {
        try {
            const response = await fetch('https://gestion-stock-reviews-bys1.vercel.app//add_product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                console.log('Product saved successfully!');
                navigate(-1); 
            } else {
                console.error('Failed to save product:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving product:', error.message);
        }
    };

    const onFinish = (values) => {
        console.log('Received values of form:', values);
        handleSave(values); 
    };

    return (
        <div style={{ padding: 20 }}>
            <Col xs={24} sm={24} md={16}>
                <Card style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>General information</h3>
                        <h4 onClick={() => navigate(-1)} style={{ color: red, cursor: 'pointer' }}>
                            {' '}
                            <ArrowLeftOutlined /> Return
                        </h4>
                    </div>
                    <br />
                    <Form layout="vertical" className="ant-advanced-search-form" onFinish={onFinish}>
                        <Row gutter={16}>
                        <Col xs={24} sm={12} md={8}>
                                <Form.Item name="product_type" label="Product type" rules={[{ required: true, message: 'Please enter product type' }]}>
                                    <Input placeholder="Product type" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="product_name" label="Name" rules={[{ required: true, message: 'Please enter product name' }]}>
                                    <Input placeholder="Name" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please enter quantity' }]}>
                                    <Input placeholder="Quantity" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item
                                    name="price_per_product"
                                    label="Price"
                                    rules={[{ required: true, message: 'Please enter price per product' }]}
                                >
                                    <Input placeholder="Price" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[{ required: true, message: 'Please enter description' }]}
                                >
                                    <Input.TextArea placeholder="Description" rows={4} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} style={{ textAlign: 'right' }}>
                                <Button className="custom-button" htmlType="submit">
                                    Save
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
        </div>
    );
};

export default AddProduct;
