import React, { Component } from 'react';
import { MDBModal, MDBModalBody, MDBModalHeader, MDBBtn, MDBIcon, MDBView, MDBMask } from 'mdbreact'
import { Upload, Icon, InputNumber, Select, Form, Input, Button, DatePicker } from 'antd'
import Lightbox from 'react-image-lightbox';
import * as cont from './const'
import './style.scss'
class ModalNewBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            previewVisible: false,
            imageUrl: '',
            changeToSave: true
        }
    }
    beforeUpload = file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            this.$utils.toastError(cont.LIMIT_FORMAT);
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            this.$utils.toastError(cont.LIMIT_SIZE);
        }
        return isJpgOrPng && isLt2M;
    }

    changeImg = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.$utils.getBase64(info.file.originFileObj, imageUrl =>{
                this.setState({
                    imageUrl,
                    loading: false,
                    changeToSave: false
                })
            }
            )
        }
    }

    handleSelectTopic = id => {
        this.setState({
            topic: id,
            changeToSave: false
        })
    }

    changeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value,
            changeToSave: false
        });
    };

    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    handleSubmit = e => {
        const {  addNewBook, toggleModal } = this.props
        const { imageUrl } = this.state
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { name, author, topic, discount, price, inventory, pages, size, publishDate, weight, description } = values
                const body = {
                    title: name,
                    author: author,
                    size: size,
                    numPage: pages,
                    weight: weight + ' gram',
                    publishDate: publishDate.format('YYYY-MM-DD'),
                    price: price,
                    bookField: topic,
                    description: description,
                    image: imageUrl.slice(22),
                    inventory: inventory,
                    discount: discount,
                }
                addNewBook(body)
                setTimeout(() => {
                    toggleModal()
                }, 5000);
            }
        });
    };
    render() {
        const { modal, toggleModal, fieldsBook, form } = this.props
        const { imageUrl, previewVisible, loading } = this.state
        const { getFieldDecorator } = form;
        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Thêm ảnh</div>
            </div>
        );
        return (
            <div className='modal-wrapper'>
                <MDBModal className='modal-new' cascading isOpen={modal} size='lg'>
                    <MDBModalHeader
                        tag="h5"
                        className=" green accent-3"
                        toggle={toggleModal}
                        titleClass="w-100">
                        <MDBIcon className='mr-2' icon="plus" />
                        {cont.MODAL_TITLE}
                    </MDBModalHeader>
                    <MDBModalBody >
                        <Form onSubmit={this.handleSubmit}>
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='row'>
                                        <div className='col-12'>
                                            {
                                                imageUrl !== '' &&
                                                <React.Fragment>
                                                    <label>Xem trước</label>
                                                    <MDBView hover onClick={() => this.setState({ previewVisible: true })}>
                                                        <img className='img-lightbox mb-2 img-fluid'
                                                            src={imageUrl}
                                                            alt='Gallery'
                                                            waves="true"
                                                            overlay="true" />
                                                        <MDBMask className="flex-center" overlay="white-light" />
                                                    </MDBView>
                                                </React.Fragment>
                                            }
                                            <Form.Item label='Thêm ảnh'>
                                                {getFieldDecorator('fileList', {
                                                    valuePropName: 'fileList',
                                                    getValueFromEvent: this.normFile,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: cont.REQUIRE_IMAGE
                                                        },
                                                    ],
                                                })(
                                                    <Upload
                                                        accept="image/png, image/jpeg"
                                                        listType="picture-card"
                                                        className="avatar-uploader"
                                                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                        showUploadList={false}
                                                        beforeUpload={this.beforeUpload}
                                                        onPreview={this.handlePreview}
                                                        onChange={this.changeImg}
                                                    >
                                                        {imageUrl === '' ? uploadButton : <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />}
                                                    </Upload>
                                                )}
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <Form.Item label='Tên sách'>
                                                {getFieldDecorator('name', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: cont.REQUIRE_NAME,
                                                        },
                                                    ],
                                                })(
                                                    <Input.TextArea
                                                        autoSize={{ minRows: 2, maxRows: 6 }} />
                                                )}
                                            </Form.Item>
                                        </div>
                                        <div className='col-6'>
                                            <Form.Item label='Tác giả'>
                                                {getFieldDecorator('author', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: cont.REQUIRE_AUTHOR,
                                                        },
                                                    ],
                                                })(
                                                    <Input size='large' />
                                                )}
                                            </Form.Item>
                                        </div>
                                        <div className='col-6'>
                                            <Form.Item label='Danh mục'>
                                                {getFieldDecorator('topic', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: cont.REQUIRE_TOPIC
                                                        },
                                                    ],
                                                })(
                                                    <Select
                                                        placeholder={cont.REQUIRE_TOPIC}
                                                        style={{ width: '100%' }}
                                                        size='large' >
                                                        {

                                                            fieldsBook.length > 0 &&
                                                            fieldsBook.map((item, index) =>
                                                                <Select.Option key={index} value={item.id}>
                                                                    {item.name}
                                                                </Select.Option>)
                                                        }
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </div>
                                        <div className='col-6'>
                                            <Form.Item label='Khuôn khổ'>
                                                {getFieldDecorator('size', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: cont.REQUIRE_SIZE,
                                                        },
                                                    ],
                                                })(
                                                    <Input size='large' />
                                                )}
                                            </Form.Item>
                                        </div>
                                        <div className='col-6'>
                                            <Form.Item label='Đơn giá'>
                                                {getFieldDecorator('price', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: cont.REQUIRE_PRICE
                                                        },
                                                    ],
                                                })(
                                                    <InputNumber
                                                        min={1000}
                                                        style={{ width: '100%' }}
                                                        step={1000}
                                                        size='large'
                                                    />
                                                )}
                                            </Form.Item>
                                        </div>

                                        <div className='col-6'>
                                            <Form.Item label='Tồn kho'>
                                                {getFieldDecorator('inventory', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: cont.REQUIRE_IVENTORY
                                                        },
                                                    ],
                                                })(
                                                    <InputNumber
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        size='large'
                                                    />
                                                )}
                                            </Form.Item>
                                        </div>
                                        <div className='col-6'>
                                            <Form.Item label='Giảm giá (%)'>
                                                {getFieldDecorator('discount', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: cont.REQUIRE_DISCOUNT
                                                        },
                                                    ],
                                                })(
                                                    <InputNumber
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        size='large'
                                                        step={0.1}
                                                        max={100}
                                                    />
                                                )}
                                            </Form.Item>
                                        </div>
                                        <div className='col-6'>
                                            <Form.Item label='Số trang'>
                                                {getFieldDecorator('pages', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: cont.REQUIRE_PAGES
                                                        },
                                                    ],
                                                })(
                                                    <InputNumber
                                                        min={1}
                                                        style={{ width: '100%' }}
                                                        size='large'
                                                        step={1}
                                                    />
                                                )}
                                            </Form.Item>
                                        </div>
                                        <div className='col-6'>
                                            <Form.Item label='Trọng lượng(gram)'>
                                                {getFieldDecorator('weight', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: cont.REQUIRE_WEIGHT
                                                        },
                                                    ],
                                                })(
                                                    <InputNumber
                                                        min={1}
                                                        style={{ width: '100%' }}
                                                        size='large'
                                                        step={1}
                                                    />
                                                )}
                                            </Form.Item>
                                        </div>
                                        <div className='col-6'>
                                            <Form.Item label='Ngày phát hành'>
                                                {getFieldDecorator('publishDate', {
                                                    rules: [
                                                        {
                                                            type: 'object',
                                                            required: true,
                                                            message: cont.REQUIRE_DATE
                                                        },
                                                    ],
                                                })(
                                                    <DatePicker
                                                        style={{ width: '100%' }}
                                                        size='large'
                                                        placeholder='Chọn ngày'
                                                        format='DD-MM-YYYY' />
                                                )}
                                            </Form.Item>
                                        </div>
                                        <div className='col-12'>
                                            <Form.Item label='Mô tả'>
                                                {getFieldDecorator('description', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: cont.REQUIRE_DES,
                                                        },
                                                    ],
                                                })(
                                                    <Input.TextArea
                                                        autoSize={{ minRows: 2, maxRows: 6 }} />
                                                )}
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Form.Item className='text-center mt-3'>
                                <MDBBtn className='rounded-pill' outline onClick={toggleModal}>Hủy</MDBBtn>
                                <Button
                                    size='large'
                                    type='primary'
                                    className='text-white'
                                    shape="round"
                                    htmlType="submit">
                                    Lưu
                                </Button>
                            </Form.Item>
                        </Form>
                    </MDBModalBody>
                    {previewVisible && (
                        <Lightbox
                            mainSrc={imageUrl}
                            onCloseRequest={() => this.setState({ previewVisible: false })}
                        />
                    )}
                </MDBModal>
            </div>
        )
    }
}

const Wrapper = Form.create({ name: 'update_book' })(ModalNewBook)
export default Wrapper;