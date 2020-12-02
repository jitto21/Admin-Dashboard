export interface AuthModel {
    _id?: string;
    fname: string;
    mname?: string;
    lname: string;
    empid: string;
    email: string;
    uname: string;
    pass: string;
    phone: string;
    altPhone?: number;
    designation: string;
    doj: Date;
    gender: string;
    access: {[key: string]: boolean}
}