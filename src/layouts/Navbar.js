import React from 'react';
import { AppstoreAddOutlined, HomeOutlined } from '@ant-design/icons';
import { Image, Layout, Menu } from 'antd';
import { useNavigate ,Outlet} from 'react-router-dom';
import image from '../assets/images/stock_logo.png';

const { Header, Content, Footer, Sider } = Layout;

const Navbar = () => {
  const navigate = useNavigate();

  const handleMenuClick = (key) => {
    navigate(`/${key}`);
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white' }}>
        <div className="demo-logo" style={{ backgroundColor: 'white' }}>
          <Image src={image} width={70} preview={false} />
        </div>
        <Menu
          mode="horizontal"
          style={{ flex: 1, minWidth: 0, backgroundColor: 'white', marginLeft: 100 }}
        >
          <Menu.Item
            onClick={() => handleMenuClick('dashboard')}
            style={{ fontFamily: 'Poppins' }}
          >
            <HomeOutlined style={{ marginRight: 10 }} />
            Home
          </Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: '0 0px' }}>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider style={{ background: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} width={200}>
            <Menu
              className="custom-menu"
              mode="inline"
              defaultSelectedKeys={['dashboard']}
              defaultOpenKeys={['dashboard']}
              style={{ height: '100%', marginTop: 25 }}
            >
              <Menu.Item
                onClick={() => handleMenuClick('dashboard')}
              >
                <AppstoreAddOutlined />
                <span style={{ fontFamily: 'Poppins' }}>Dashboard</span>
              </Menu.Item>
              <Menu.Item
                onClick={() => handleMenuClick('upload')}
              >
                <AppstoreAddOutlined />
                <span style={{ fontFamily: 'Poppins' }}>Clients reviews</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content style={{ padding: '24px', minHeight: '100vh',backgroundColor:'white' }}>
            {/* This will render child routes */}
            <Outlet />
          </Content>
        </Layout>  
      </Content>
      <Footer style={{ textAlign: 'center' }}>
      IPSSI ©{new Date().getFullYear()} Created by CHIHAB MEZRIGUI 
      </Footer>
    </Layout>
  );
};

export default Navbar;