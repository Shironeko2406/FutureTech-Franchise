import React, { useEffect, useState } from "react";
import { Badge, notification } from "antd";
import { BellOutlined } from "@ant-design/icons";
import * as signalR from "@microsoft/signalr";

const HomeStudent = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected"); // Trạng thái kết nối SignalR

  // Gọi API để lấy số lượng thông báo chưa đọc khi component được render
  const fetchUnreadNotifications = async () => {
    try {
      const response = await fetch(
        "https://localhost:7116/api/v1/notifications",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Thêm accessToken nếu cần
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.isSuccess) {
        setNotificationCount(data.data); // Cập nhật số lượng thông báo từ API
      } else {
        notification.error({
          message: "Lỗi",
          description: data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể truy xuất số thông báo chưa đọc!",
      });
    }
  };

  useEffect(() => {
    // Gọi API khi component render lần đầu
    fetchUnreadNotifications();

    // Tạo kết nối SignalR
    const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7116/notificationHub", {
      accessTokenFactory: () => localStorage.getItem("accessToken") // Lấy token từ localStorage
    })
      .withAutomaticReconnect()
      .build();

    // Bắt đầu kết nối đến SignalR
    connection
      .start()
      .then(() => {
        console.log("SignalR connected successfully.");
        setConnectionStatus("Connected"); // Cập nhật trạng thái kết nối

        // Đăng ký sự kiện 'ReceiveNotification' từ server
        connection.on("ReceiveNotification", (message) => {
          console.log("Received notification:", message);

          // Cập nhật số lượng thông báo theo dữ liệu realtime từ server
          if (message.isSuccess) {
            setNotificationCount(message.data);
            console.log(message);
          } else {
            notification.error({
              message: "Lỗi nhận thông báo",
              description: message.message,
            });
          }
        });
      })
      .catch((error) => {
        console.error("SignalR connection failed: ", error);
        setConnectionStatus("Failed"); // Cập nhật trạng thái nếu kết nối thất bại
      });

    // Dọn dẹp kết nối khi component bị unmount
    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <p>Trạng thái kết nối: {connectionStatus}</p>{" "}
      {/* Hiển thị trạng thái kết nối */}
      <Badge count={notificationCount}>
        <BellOutlined style={{ fontSize: "24px" }} />
      </Badge>
    </div>
  );
};

export default HomeStudent;
