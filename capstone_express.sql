use capstone_express;

create table nguoi_dung(
	nguoi_dung_id int auto_increment,
    email varchar(255) not null,
    mat_khau varchar(255) not null,
    ho_ten varchar(255) not null,
    tuoi int,
    anh_dai_dien varchar(255),
    primary key (nguoi_dung_id)
);

create table hinh_anh(
	hinh_id int auto_increment,
    ten_hinh varchar(255) not null,
    duong_dan varchar(255) not null,
    mo_ta varchar(255),
    nguoi_dung_id int,
    primary key (hinh_id),
    foreign key (nguoi_dung_id) references nguoi_dung(nguoi_dung_id)
);

create table binh_luan (
	binh_luan_id int auto_increment,
    nguoi_dung_id int,
    hinh_id int,
    ngay_binh_luan date,
    noi_dung varchar(255),
    primary key (binh_luan_id),
    foreign key (nguoi_dung_id) references nguoi_dung(nguoi_dung_id),
    foreign key (hinh_id) references hinh_anh(hinh_id)
);

create table luu_anh(
	nguoi_dung_id int,
    hinh_id int,
    ngay_luu date,
    primary key (nguoi_dung_id, hinh_id),
    foreign key (nguoi_dung_id) references nguoi_dung(nguoi_dung_id),
    foreign key (hinh_id) references hinh_anh(hinh_id)
)


