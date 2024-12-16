import React, { useEffect, useState } from 'react';
import { Card, Result, Button, Typography, Spin } from 'antd';
import { CheckCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const PaymentSuccess = () => {
  const [contractId, setContractId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderIdParam = searchParams.get('orderId');
    setContractId(orderIdParam);
    setLoading(false);
  }, [location]);

  const handleReturnToDashboard = () => {
    navigate('/agency-manager/list-task');
  };

  if (loading) {
    return (
      <Card style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </Card>
    );
  }

  return (
    <Card>
      <Result
        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        status="success"
        title={<Title level={2}>Thanh toán hợp đồng thành công!</Title>}
        subTitle={
          <Paragraph>
            Cảm ơn bạn đã thanh toán. Hợp đồng của bạn đã được xác nhận và có hiệu lực.
          </Paragraph>
        }
        extra={[
          <Button
            key="dashboard"
            onClick={handleReturnToDashboard}
          >
            Trở về
          </Button>
        ]}
      >
        {/* <div style={{ background: '#f0f2f5', padding: '24px', borderRadius: '2px' }}>
          <Paragraph>
            <strong>Mã hợp đồng:</strong> {contractCode}
          </Paragraph>
          <Paragraph>
            Hợp đồng của bạn đã được kích hoạt. Bạn có thể xem chi tiết hợp đồng bằng cách nhấn vào nút "Xem chi tiết hợp đồng" ở trên.
          </Paragraph>
        </div> */}
      </Result>
    </Card>
  );
};

export default PaymentSuccess;

