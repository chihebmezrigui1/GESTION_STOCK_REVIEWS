import { Button, Card, Checkbox, Col, Table, Tag, DatePicker, Form, Input, Row, Space, Progress, Avatar, Popover, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { pink, blue, red } from '../../constants/colors';
import './styles.css'
import { DeleteOutlined, EditOutlined, EyeOutlined, ProductOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { Chart } from "react-google-charts";



export const style = {
    backgroundColor: 'white',
    color: '#bb3493',
    fontSize: 16,
    fontWeight: 'bold',
}

const Dashboard = () => {

    const [showParentsInputs, setShowParentsInputs] = useState(false);
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState()
    const [productToDelete, setProductToDelete] = useState()
    const [modalVisible, setModalVisible] = useState()
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://gestion-stock-reviews-bys1.vercel.app//products');
        setProducts(response.data);
        console.log("products",response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const calculateChartData = () => {
        const productTypes = {};
        products.forEach((product) => {
            if (product.product_type in productTypes) {
                productTypes[product.product_type]++;
            } else {
                productTypes[product.product_type] = 1;
            }
        });

        const labels = Object.keys(productTypes);
        const series = labels.map((label) => productTypes[label]);

        setChartState((prevState) => ({
            ...prevState,
            options: {
                ...prevState.options,
                labels,
            },
            series,
        }));
    };

    calculateChartData();
}, [products]);


    const handleOpenChange = (visible) => {
      setOpen(visible);
    };
  
    const navigate = useNavigate()

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`https://gestion-stock-reviews-bys1.vercel.app//products/${id}`);
            setProducts(products.filter(product => product.id !== id));
            setModalVisible(false);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEditProduct = (record) => {
        navigate(`/updateproduct/${record._id}`, { state: { initialValues: record } });
    };


    const columns = [
        {
            title: <span className="custom-table-span-column">Barcode</span>,
            key: '_id',
            dataIndex: '_id',
            render: (_id) => (
              <span>
                <Tag color='red'>{_id}</Tag>
              </span>
            ),
          },
          {
            title: <span className="custom-table-span-column">Product type</span>,
            dataIndex: 'product_type',
            key: 'product_type',
        },
        {
            title: <span className="custom-table-span-column">Model</span>,
            dataIndex: 'product_name',
            key: 'product_name',
            render: (text, record) => (
               
                  <span>{text}</span>
              ),
              className: 'custom-column',
        },
        {
            title: <span className="custom-table-span-column">Quantity</span>,
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: <span className="custom-table-span-column">Price per prod</span>,
            dataIndex: 'price_per_product',
            key: 'price_per_product',
        },
        {
            title: <span className="custom-table-span-column">Actions</span>,
            key: 'actions',
            render: (text, record) => (
              <span>
                <EyeOutlined onClick={() => handleViewProduct(record)} style={{color:blue, fontSize:18, marginRight:2, cursor:'pointer'}} />
                <DeleteOutlined onClick={() => { setProductToDelete(record); setModalVisible(true); }} style={{color:red, fontSize:18, marginRight:2, cursor:'pointer'}} />
                <EditOutlined onClick={() => handleEditProduct(record)} style={{ color: 'orange', fontSize: 18, cursor: 'pointer' }} />
                </span>
            ),
          },
    
    ];

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            birthdate: '2020-01-05',
            email: 'contact@email.com',
            tags: ['FR485118774844'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            birthdate: '1995-01-05',
            email: 'contact@email.com',
            tags: ['FR485118774844'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            birthdate: '1990-01-05',
            email: 'contact@email.com',
            tags: ['FR485118774844'],
        },
    ];



    //   Apex chart********************************
  
    const [chartState, setChartState] = useState({
        series: [],
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: [],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        },
    });

    const [chartData, setChartData] = useState([
        ['Product Type', 'Quantity'],
        ['PC', 0],
        ['Smartphone', 0],
        ['Console', 0],
      ]);
    
      useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await axios.get('https://gestion-stock-reviews-bys1.vercel.app//products');
            const products = response.data;
    
            const productTypes = {
              PC: 0,
              Smartphone: 0,
              Console: 0,
              TV :0
            };
    
            products.forEach((product) => {
              if (productTypes[product.product_type] !== undefined) {
                productTypes[product.product_type] += product.quantity;
              }
            });
    
            const newChartData = [
              ['Product Type', 'Quantity'],
              ['TV', productTypes.TV],
              ['PC', productTypes.PC],
              ['Smartphone', productTypes.Smartphone],
              ['Console', productTypes.Console],
            ];
    
            setChartData(newChartData);
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
    
        fetchProducts();
      }, []);
    
      const options = {
        title: 'Quantities of Different Product Types',
        width: 800,
        height: 400,
        bar: { groupWidth: '95%' },
        legend: { position: 'none' },
        
      };
    

    const totalSmartphones = products.filter(product => product.product_type === 'Smartphone').length;
    const totalTVs = products.filter(product => product.product_type === 'TV').length;
    const totalConsole = products.filter(product => product.product_type === 'Console').length;

    return (
        <div>
            <div style={{ padding: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '77%' }}>
                    <h2>Stock Overview </h2>
                    <Modal
                        centered
                        open={open}
                        onOk={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                        width={1000}
                    >
                        <h3 style={{marginBottom:15,color:red}}>Product details</h3>
                        {selectedProduct ? (
                            <div>
                                <p><strong>Barcode:</strong> <Tag color='red'>{selectedProduct._id}</Tag></p>
                                <p><strong>Product Type:</strong> {selectedProduct.product_type}</p>
                                <p><strong>Model:</strong> {selectedProduct.product_name}</p>
                                <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
                                <p><strong>Price per Product:</strong> {selectedProduct.price_per_product} $</p>
                            </div>
                        ) : (
                            <p>No product selected</p>
                        )}
                    </Modal>
                    <Modal
                        title="Confirm Deletion"
                        centered
                        open={modalVisible}
                        onOk={() => handleDeleteProduct(productToDelete.id)}
                        onCancel={() => setModalVisible(false)}
                    >
                        <p>Are you sure you want to delete this product?</p>
                    </Modal>
                    {/* <div className="search-container">
                        <Input
                            placeholder="Enter your search"
                            className={`search-input ${isSearchVisible ? 'expanded' : ''}`}
                            prefix={<SearchOutlined className="search-icon" />}
                            style={{ width: isSearchVisible ? '500px' : '0' }}
                        // Add other input props or handlers as needed
                        />
                        <Button
                            icon={<SearchOutlined />}
                            className={`search-icon ${isSearchVisible ? 'hidden' : ''}`}
                            onClick={handleSearchClick}
                        />
                    </div> */}


                </div>
            </div>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24}>
                    <div style={{ display: 'flex' }}>
                        <Card className='custom-card-clients-overview'>
                            <p className='title-card'>Total Products</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '250px' }}>
                                <p className='content-card'>{products.length}</p>
                                <div className='circle-icon'>
                                    <ProductOutlined style={{ fontSize: 24, color: blue }} />
                                </div>
                            </div>
                        </Card>
                        <Card className='custom-card-clients-overview'>
                            <p className='title-card'>Total Smartphones</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '250px' }}>
                                <p className='content-card'>{totalSmartphones}</p>
                                <div className='circle-icon'>
                                    <ProductOutlined style={{ fontSize: 24, color: blue }} />
                                </div>
                            </div>
                        </Card>
                        <Card className='custom-card-clients-overview'>
                            <p className='title-card'>Total TVs</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '250px' }}>
                                <p className='content-card'>{totalTVs}</p>
                                <div className='circle-icon'>
                                    <ProductOutlined style={{ fontSize: 24, color: blue }} />
                                </div>
                            </div>
                        </Card>
                        <Card className='custom-card-clients-overview'>
                            <p className='title-card'>Total Consoles</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '250px' }}>
                                <p className='content-card'>{totalConsole}</p>
                                <div className='circle-icon'>
                                    <ProductOutlined style={{ fontSize: 24, color: blue }} />
                                </div>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={16} style={{width:1200}}>
                    <div style={{ display: 'flex', justifyContent: 'end',minWidth:1200 }}>
                        <Button onClick={() => navigate('/addproduct')} className="custom-button-add-product" >
                            Add new product
                        </Button>
                    </div>
                    <Table style={{ width: '100%', minWidth: 1200 }} columns={columns} dataSource={products} />
                </Col>
            </Row>
          
            <br />
            <Row>
            <Col xs={24} sm={24} md={8}>
                    <div style={{ marginTop: 40 }} >
                        <h4>Products Visualisation</h4>
                        <ReactApexChart options={chartState.options} series={chartState.series} type="pie" width={420} />
                        
                    </div>
            </Col>
            <Col xs={24} sm={24} md={8}>
                    <div style={{ marginTop: 40 ,marginLeft:20}} >
                        <h4>Products Visualisation</h4>
                        <Chart
                        chartType="BarChart"
                        width="100%"
                        height="400px"
                        data={chartData}
                        options={options}
                        />                        
                    </div>
                </Col>
            </Row>
               
              
          
          
            <br />

        </div>
    );
}

export default Dashboard;
