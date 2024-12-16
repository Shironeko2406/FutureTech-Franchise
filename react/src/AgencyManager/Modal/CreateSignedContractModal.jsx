import React, { useState, useEffect } from 'react';
import { Modal, Form, Upload, Button, message } from 'antd';
import { UploadOutlined, DownloadOutlined, CreditCardOutlined } from "@ant-design/icons";
import { imageDB } from "../../Firebasse/Config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useDispatch, useSelector } from 'react-redux';
import { useLoading } from '../../Utils/LoadingContext';
import { GetContractDetailByAgencyIdActionAsync } from '../../Redux/ReducerAPI/ContractReducer';
import { CreatePaymentContractActionAsync } from '../../Redux/ReducerAPI/PaymentReducer';
import { USER_LOGIN } from '../../Utils/Interceptors';
import { getDataJSONStorage } from '../../Utils/UtilsFunction';
import { AgencySubmitTaskActionAsync } from '../../Redux/ReducerAPI/WorkReducer';


const CreateSignedContractModal = ({ visible, onClose, filters, pageIndex, pageSize, onRefreshTasks, taskId }) => {
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const { contractDetail } = useSelector((state) => state.ContractReducer);
    const { setLoading } = useLoading();
    const agencyId = getDataJSONStorage(USER_LOGIN).agencyId

    const requiredPayment = (contractDetail?.depositPercentage / 100) * contractDetail?.total;

    useEffect(() => {
        if (visible) {
            dispatch(GetContractDetailByAgencyIdActionAsync(agencyId))
        }
    }, [visible, dispatch]);


    const handleSubmit = async (value) => {
        setLoading(true)
        let formattedValues = {
            ...value,
            contractDocumentImageURL: file ? file.url : null, // Use fileUrl to store the URL
            agencyId: agencyId
        }

        // dispatch(AgencyUploadContractActionAsync(formattedValues, filters, pageIndex, pageSize)).then((res) => {
        //     setLoading(false)
        //     if (res) {
        //         form.resetFields()
        //         setFile(null)
        //         onClose()
        //     }
        // }).catch((err) => {
        //     console.log(err)
        //     setLoading(false)
        // });  

        setLoading(true);
        const success = await dispatch(AgencySubmitTaskActionAsync(taskId, file.url));
        setLoading(false);
        if (success) {
            message.success("Nộp tài liệu thành công");
            onClose();
            onRefreshTasks();
        }
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        const storageRef = ref(imageDB, `files/${file.name}`);
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setFile({ url, name: file.name }); // Store file name and URL
            onSuccess(null, file);
        } catch (error) {
            console.error("Upload error: ", error);
            onError(error);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    const downloadSampleContract = async () => {
        setLoading(true);
        const res = await dispatch(GetContractDetailByAgencyIdActionAsync(agencyId));
        setLoading(false);
        if (res && res.contractDocumentImageURL) {
            window.open(res.contractDocumentImageURL, "_blank");
        } else {
            message.error("Chưa có hợp đồng nào được tạo ra.");
        }
    };

    const handlePaymentContract = async () => {
        setLoading(true);
        await dispatch(CreatePaymentContractActionAsync(contractDetail?.id));
        setLoading(false);
    };

    return (
        <Modal
            title="Nộp bản ký hợp đồng"
            open={visible}
            onCancel={onClose}
            width={700}
            footer={[
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button key="downloadContract" icon={<DownloadOutlined />} onClick={downloadSampleContract} type="primary">
                            Tải hợp đồng trung tâm gửi
                        </Button>
                        {contractDetail?.paidAmount < requiredPayment && ( // Kiểm tra điều kiện
                            <Button
                                key="paymentContract"
                                icon={<CreditCardOutlined />}
                                type="primary"
                                onClick={handlePaymentContract}
                            >
                                Tạo thanh toán
                            </Button>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button key="back" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button key="submit" type="primary" onClick={() => form.submit()}>
                            Nộp hợp đồng
                        </Button>
                    </div>
                </div>
            ]}

        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="contractDocumentImageURL"
                    label={'File hợp đồng đã ký'}
                    rules={[{ required: true, message: 'Vui lòng thêm file hợp đồng đã ký' }]}
                >
                    <Upload
                        name="reportFile"
                        customRequest={handleUpload}
                        onRemove={handleRemoveFile}
                        accept="*"
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Thêm file</Button>
                    </Upload>
                </Form.Item>
                {/* {taskType === "Design" && (
                    <Form.Item
                        name="equipmentFile"
                        label="File trang thiết bị"
                    >
                        <Upload
                            name="equipmentFile"
                            customRequest={handleUploadFileEquipment}
                            accept=".xls,.xlsx"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải file trang thiết bị</Button>
                        </Upload>
                    </Form.Item>
                )} */}
                {/* {taskType === "AgreementSigned" && (
                    <Button key="createAgreement" type="primary" onClick={() => setModalCreateAgreementVisible(true)}>
                        Thêm mới Thỏa Thuận Nguyên Tắc
                    </Button>
                )}
                {taskType === "BusinessRegistered" && (
                    <Button key="createBusinessRegistration" type="primary" onClick={() => setModalCreateBusinessRegistrationVisible(true)}>
                        Thêm mới Giấy Đăng Ký Doanh Nghiệp
                    </Button>
                )}
                {taskType === "EducationLicenseRegistered" && (
                    <Button key="createEducationalOperationLicense" type="primary" onClick={() => setModalCreateEducationalOperationLicenseVisible(true)}>
                        Thêm mới giấy phép đăng ký giáo dục
                    </Button>
                )} */}
            </Form>
            {/* <CreateAgreementModal
                visible={modalCreateAgreementVisible}
                onClose={() => setModalCreateAgreementVisible(false)}
                agencyId={taskDetail?.agencyId}
            />
            <CreateBusinessRegistrationModal
                visible={modalCreateBusinessRegistrationVisible}
                onClose={() => setModalCreateBusinessRegistrationVisible(false)}
                agencyId={taskDetail?.agencyId}
            /> */}
            {/* <CreateSignedContractModal
                visible={modalCreateSignedContractVisible}
                onClose={() => setModalCreateSignedContractVisible(false)}
                agencyId={taskDetail?.agencyId}
            /> */}

            {/* <CreateEducationalOperationLicenseModal
                visible={modalCreateEducationalOperationLicenseVisible}
                onClose={() => setModalCreateEducationalOperationLicenseVisible(false)}
                agencyId={taskDetail?.agencyId}
            /> */}
        </Modal>
    );
};

export default CreateSignedContractModal;