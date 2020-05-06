let imgBaseUrl = '';


if (process.env.NODE_ENV == 'development') {
    imgBaseUrl = '/img/';
}else if(process.env.NODE_ENV == 'production'){
    imgBaseUrl = '/eleme/img/';
}

export { imgBaseUrl }