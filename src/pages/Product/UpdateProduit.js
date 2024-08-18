import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { red } from '../../constants/colors';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const UpdateProduct = () => {


    const { id } = useParams(); // Retrieve the ID parameter from the URL
    const navigate = useNavigate();
    const location = useLocation();

    const { initialValues } = location.state || {}; 
    console.log("init",initialValues.id);


    const handleSave = async (values) => {
        try {
            const updatedProduct = { ...values, id };
            const response = await fetch(`http://localhost:5000/products/${initialValues.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct), 
            });

            if (response.ok) {
                console.log('Product updated successfully!');
                navigate(-1); 
            } else {
                console.error('Failed to update product:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating product:', error.message);
        }
    };

    const onFinish = (values) => {
        console.log('Received values of form:', values);
        handleSave(values); // Call handleSave to send updated data to backend
    };

    return (
        <div style={{ padding: 20 }}>
            <Col xs={24} sm={24} md={16}>
                <Card style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>Update product</h3>
                        <h4 onClick={() => navigate(-1)} style={{ color: red, cursor: 'pointer' }}>
                            {' '}
                            <ArrowLeftOutlined /> Return
                        </h4>
                    </div>
                    <br />
                    <Form layout="vertical" className="ant-advanced-search-form" onFinish={onFinish} initialValues={initialValues}>
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
                                    <Input placeholder="Quantity" type="number" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item
                                    name="price_per_product"
                                    label="Price"
                                    rules={[{ required: true, message: 'Please enter price per product' }]}
                                >
                                    <Input placeholder="Price" type="number" step="0.01" />
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

export default UpdateProduct;