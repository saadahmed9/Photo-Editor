// Importing required libraries and components
import React, { useState, useRef, useEffect } from "react";
import { Card, Upload, Button, Layout, Spin, Modal, Tooltip } from 'antd';
import { UploadOutlined, LoadingOutlined, InfoCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './passportPhoto.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cropper from "react-cropper";
import { Select } from 'antd';
import { Fade } from 'react-reveal';
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from 'antd';
import countriesData from './countriesData.jsx';


// Constants and initial configurations
const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 48,
            color: 'black'
        }}
        spin
    />
);
const { Option } = Select;
const { Sider, Content } = Layout;

// Content section component
const ContentSection = ({ children }) => {
    return (
        <Content style={{ padding: "0 50px" }}>
            <div className="site-layout-content">{children}</div>
        </Content>
    );
};



// Main PassportPhoto component
const PassportPhoto = (props1) => {

    // States and Refs initialization
    const { uuid } = props1;
    const [imageUrl, setImageUrl] = useState();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(16 / 9)
    const [cropperKey, setCropperKey] = useState(0);
    const cropperRef = useRef(null);
    const [fileType, setFileType] = useState(null);
    const [displayUrl, setDisplayUrl] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setfileName] = useState(null);
    const [zoom, setZoom] = useState(1); // New state for zoom level
    const [isPreviewActive, setIsPreviewActive] = useState(false);

    // ... other states and functions ...


    // Function to handle zoom in
    const zoomIn = () => {
        const newZoom = zoom + 0.1;
        setZoom(newZoom);
        cropperRef.current.cropper.zoomTo(newZoom);
    };

    // Function to handle zoom out
    const zoomOut = () => {
        const newZoom = zoom - 0.1;
        if (newZoom > 0) {
            setZoom(newZoom);
            cropperRef.current.cropper.zoomTo(newZoom);
        }
    };

    const onCropperReady = () => {
        const initialZoom = 1; // or any other default zoom level you prefer
        setZoom(initialZoom);
        if (cropperRef.current && cropperRef.current.cropper) {
            cropperRef.current.cropper.zoomTo(initialZoom);
        }
    };


    // Function to handle sidebar collapse
    const onCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };

    const countryUrlMap = {
        Afghanistan: 'https://photogov.com/documents-requirements/af-passport-40x45-photo/',
        Albania: 'https://photogov.com/documents-requirements/al-visa-47x36mm-photo/',
        Algeria: 'https://photogov.com/documents-requirements/dz-passport-photo/',
        Angola: 'https://photogov.com/documents/ao-visa-photo/',
        Argentina: 'https://photogov.com/documents-requirements/ar-passport-15x15-inch-photo/',
        Armenia: 'https://www.ivisa.com/photo/blog/armenia-passportvisa-photo-requirements-and-size',
        Austria: 'https://www.ivisa.com/photo/blog/austria-passportvisa-photo-requirements-and-size',
        Azerbaijan: 'https://photogov.com/documents-requirements/az-visa-photo/',
        Bahrain: 'https://photogov.com/documents-requirements/bh-passport-photo/',
        Bangladesh: 'https://www.ivisa.com/photo/blog/bangladesh-passportvisa-photo-requirements-and-size',
        Barbados: 'https://www.ivisa.com/photo/blog/barbados-passportvisa-photo-requirements-and-size',
        Belarus: 'https://gomel.mvd.gov.by/en/page/tehnicheskie-trebovaniya-fotografii-na-pasport',
        Belgium: 'https://www.ivisa.com/photo/blog/belgium-passport-visa-photo-requirements-and-size',
        Bhutan: 'https://www.ivisa.com/photo/blog/bhutan-passportvisa-photo-requirements-and-size',
        Botswana: 'https://photogov.com/documents-requirements/bw-passport-photo/',
        Brazil: 'https://www.gov.br/mre/pt-br/consulado-montreal/brazilian-passport',
        Bulgaria: 'https://www.ivisa.com/photo/blog/bulgaria-passportvisa-photo-requirements-and-size',
        BurkinaFaso: 'https://photogov.com/documents-requirements/bf-passport-45x35mm-photo/',
        Cambodia: 'https://photogov.com/documents-requirements/kh-visa-photo/',
        Cameroon: 'https://photogov.com/documents-requirements/cm-passport-4x5-photo/',
        Canada: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html',
        Chad: 'https://photogov.com/documents-requirements/td-passport-50x50mm-photo/',
        Chile: 'https://chile-evisa.com/chile-visa-photo-requirements-and-size/',
        China: 'https://www.ivisa.com/photo/blog/china-passport-visa-photo-requirements-and-size',
        Colombia: 'https://www.ivisa.com/photo/blog/colombia-passportvisa-photo-requirements-and-size',
        Congo: 'https://www.ivisa.com/photo/blog/the-democratic-republic-of-the-congo-passportvisa-photo-requirements-and-size',
        Croatia: 'https://www.ivisa.com/photo/blog/croatia-passportvisa-photo-requirements-and-size',
        Cyprus: 'https://photogov.com/documents-requirements/cy-passport-4x5cm-photo/',
        "Czech Republic": 'https://www.mzv.cz/jnp/en/information_for_aliens/supporting_documents_overview/photo.html',
        Denmark: 'https://photogov.com/documents-requirements/dk-passport-photo/',
        Djibouti: 'https://photogov.com/documents-requirements/dj-passport-photo/',
        Dominica: 'https://www.ivisa.com/photo/blog/dominica-passportvisa-photo-requirements-and-size',
        Egypt: 'https://egyptembassy.net/consular-services/passports-travel/issuing-egyptian-passport/',
        Estonia: 'https://www.ivisa.com/photo/blog/estonia-passportvisa-photo-requirements-and-size',
        Ethiopia: 'https://www.ivisa.com/photo/blog/ethiopia-passportvisa-photo-requirements-and-size',
        Fiji: 'https://www.immigration.gov.fj/guidelines-for-passport-photographs/',
        Finland: 'https://www.ivisa.com/photo/blog/finland-passport-visa-photo-requirements-and-size',
        France: 'https://www.service-public.fr/particuliers/vosdroits/F10619?lang=en',
        Gabon: 'https://www.ivisa.com/photo/blog/gabon-passportvisa-photo-requirements-and-size',
        Georgia: 'https://photogov.com/documents-requirements/ge-passport-photo/',
        Germany: 'https://www.germany.info/blob/906790/6e3eee9fd4d86e16aaefe0e92d809332/dd-sample-photos-data.pdf',
        Ghana: 'https://photogov.com/documents-requirements/gh-passport-35x45mm-photo/',
        Greece: 'https://www.passport.gov.gr/en/diadikasia-ekdosis/documents/specificationphoto.html',
        Guinea: 'https://www.ivisa.com/photo/blog/guinea-passportvisa-photo-requirements-and-size',
        "Guinea- Bissau": 'https://www.ivisa.com/photo/blog/guinea-bissau-passportvisa-photo-requirements-and-size',
        Guyana: 'https://www.ivisa.com/photo/blog/guyana-passportvisa-photo-requirements-and-size',
        "Hong Kong": 'https://www.immd.gov.hk/eng/residents/immigration/traveldoc/photorequirements.html',
        Hungary: 'https://www.ivisa.com/photo/blog/hungary-passportvisa-photo-requirements-and-size',
        India: 'https://visa.vfsglobal.com/one-pager/india/united-states-of-america/passport-services/pdf/photo-specifiation.pdf',
        Indonesia: 'https://www.ivisa.com/photo/blog/indonesian-passport-visa-photo-requirements-and-size-2',
        Iran: 'https://www.ivisa.com/photo/blog/iran-passportvisa-photo-requirements-and-size',
        Iraq: 'https://www.ivisa.com/photo/blog/iraq-passportvisa-photo-requirements-and-size',
        Ireland: 'https://www.dfa.ie/passports/photo-guidelines/',
        Israel: 'https://www.gov.il/en/departments/general/biometric_photo_guide',
        Italy: 'https://www.italiandualcitizenship.net/italian-passport-requirements/#:~:text=For%20passport%20renewal%2C%20you%20must,it%20has%20been%20properly%20submitted.',
        Jamaica: 'https://www.ivisa.com/photo/blog/jamaica-passportvisa-photo-requirements-and-size',
        Japan: 'https://www.sf.us.emb-japan.go.jp/itpr_en/e_m03_01_02.html#:~:text=Size%3A%2035mm%20x%2045mm%20(width,more%20than%2036%20mm%20high.',
        Jordan: 'https://www.ivisa.com/photo/blog/jordan-passportvisa-photo-requirements-and-size',
        Kazakhstan: 'https://egov.kz/cms/ru/articles/trebovaniya_k_fotografiyam',
        Kenya: 'https://www.ivisa.com/photo/blog/kenya-passport-visa-photo-requirements-and-size',
        Korea: 'https://overseas.mofa.go.kr/us-losangeles-en/brd/m_4394/view.do?seq=725383&srchFr=&srchTo=&srchWord=photo&srchTp=0&multi_itm_seq=0&itm_seq_1=0&itm_seq_2=0&company_cd=&company_nm=&page=1',
        Kuwait: 'https://photogov.com/documents-requirements/kw-passport-photo/',
        Kyrgyzstan: 'https://photogov.com/documents-requirements/kg-passport-4x6cm-photo/',
        Latvia: 'https://photogov.com/documents-requirements/lv-passport-photo/',
        Lebanon: 'https://www.general-security.gov.lb/ar/posts/11',
        Liberia: 'https://www.ivisa.com/photo/blog/liberia-passportvisa-photo-requirements-and-size',
        Libya: 'https://www.ivisa.com/photo/blog/libya-passportvisa-photo-requirements-and-size',
        Lithuania: 'https://adic.lrv.lt/en/legal-information/photos-requirements/',
        Luxembourg: 'https://www.ivisa.com/photo/blog/luxembourg-passportvisa-photo-requirements-and-size',
        Madagascar: 'https://www.ivisa.com/photo/blog/madagascar-passportvisa-photo-requirements-and-size',
        Malawi: 'https://www.ivisa.com/photo/blog/malawi-passportvisa-photo-requirements-and-size',
        Malaysia: 'https://www.imi.gov.my/index.php/en/main-services/passport/malaysian-international-passport/',
        Maldives: 'https://www.immigration.gov.mv/application/photo-standards/',
        Mali: 'https://www.ivisa.com/photo/blog/mali-passportvisa-photo-requirements-and-size',
        Malta: 'https://www.identitymalta.com/unit/passport-office/',
        Mauritius: 'https://photogov.com/documents-requirements/mu-passport-35x45mm-photo/',
        Mexico: 'https://www.ivisa.com/photo/blog/mexican-passport-visa-photo-requirements-and-size#:~:text=So%20what%20are%20the%20Mexican,be%20older%20than%206%20months.',
        Mongolia: 'https://www.ivisa.com/photo/blog/mongolia-passportvisa-photo-requirements-and-size',
        Morocco: 'https://www.passeport.ma/Home/PiecesAuMaroc?typePasseport=bio',
        Mozambique: 'https://www.ivisa.com/photo/blog/mozambique-passportvisa-photo-requirements-and-size',
        Namibia: 'https://www.ivisa.com/photo/blog/namibia-passportvisa-photo-requirements-and-size',
        Nepal: 'https://photogov.com/documents-requirements/np-passport-35x45-photo/',
        Netherlands: 'https://www.netherlandsworldwide.nl/passport-id-card/photo-requirements',
        New_Zealand: 'https://www.passports.govt.nz/passport-photos/check-your-photo-meets-the-technical-requirements/',
        Nicaragua: 'https://www.municipio.co.ni/pasaporte-desde-el-extranjero.html',
        Nigeria: 'https://photogov.com/documents-requirements/ng-passport-photo/',
        Norway: 'https://photogov.com/documents-requirements/no-passport-photo/',
        Oman: 'https://photogov.com/documents-requirements/om-passport-4x6cm-photo/',
        Pakistan: 'https://dgip.gov.pk/eServices/online-passport.php',
        Panama: 'https://www.ivisa.com/photo/blog/panama-passportvisa-photo-requirements-and-size',
        Paraguay: 'http://www.paraguayembassy.co.uk/passports.html',
        Peru: 'https://www.ivisa.com/photo/blog/peru-passportvisa-photo-requirements-and-size',
        Philippines: 'https://www.ivisa.com/photo/blog/philippines-passport-visa-photo-requirements-and-size',
        Poland: 'https://www.gov.pl/web/gov/zdjecie-do-dowodu-lub-paszportu',
        Portugal: 'https://www.ivisa.com/photo/blog/portugal-passport-visa-photo-requirements-and-size',
        Qatar: 'https://photogov.com/documents-requirements/qa-passport-38x48mm-photo/',
        Russia: 'https://russianagency.com/en/photo-requirements/',
        Saudi_Arabia: 'https://www.saudiembassy.net/guideline-accepted-photographs-saudi-visas',
        Singapore: 'https://www.mfa.gov.sg/Overseas-Mission/Phnompenh/Consular-Services/Application-for-Singapore-Passport',
        South_Africa: 'https://www.southafrica-usa.net/homeaffairs/pp_tourist.htm',
        Spain: 'https://es.usembassy.gov/passports/#guidelines',
        Thailand: 'https://thaiconsulatela.thaiembassy.org/en/publicservice/documents-required-for-renew-thai-passport-2?page=61b1064202fd6d10a962f3a4',
        Turkey: 'https://www.timpson.co.uk/services/passport-photos/international-passport-photo-sizes/turkey',
        UAE: 'https://www.ivisa.com/photo/blog/the-united-arab-emirates-passportvisa-photo-requirements-and-size',
        UK: 'https://www.gov.uk/photos-for-passports/photo-requirements#:~:text=You%20need%20to%20provide%202,version%20of%20a%20larger%20picture',
        USA: 'https://travel.state.gov/content/travel/en/passports/how-apply/photos.html',
        Vietnam: 'https://vietnamconsulate-sf.org/en/2017/05/11/thu-tuc-cap-ho-chieu-lan-dau-cho-cong-dan-viet-nam-dinh-cu-tai-hoa-ky/',
    }

    // Component for displaying hint when sidebar is collapsed
    const CollapsedHint = () => (
        <div className="collapsed-hint">
            <ArrowRightOutlined className="hint-icon" />
            <p>Choose Country</p>
        </div>
    );






    const menuItems = [
        { key: '1', name: 'Afghanistan', size: '40x45 (mm)' },
        { key: '2', name: 'Albania', size: '36x47 (mm)' },
        { key: '3', name: 'Algeria', size: '35x45 (mm)' },
        { key: '4', name: 'Angola', size: '30x40 (mm)' },
        { key: '5', name: 'Argentina', size: '38x38 (mm)' },
        { key: '6', name: 'Armenia', size: '35x45 (mm)' },
        { key: '7', name: 'Australia', size: '35x45 (mm)' },
        { key: '8', name: 'Austria', size: '35x45 (mm)' },
        { key: '9', name: 'Azerbaijan', size: '30x40 (mm)' },
        { key: '10', name: 'Bahrain', size: '40x60 (mm)' },
        { key: '11', name: 'Bangladesh', size: '50x50 (mm)' },
        { key: '12', name: 'Barbados', size: '50x50 (mm)' },
        { key: '13', name: 'Belarus', size: '40x50 (mm)' },
        { key: '14', name: 'Belgium', size: '35x45 (mm)' },
        { key: '15', name: 'Bhutan', size: '35x45 (mm)' },
        { key: '16', name: 'Botswana', size: '30x40 (mm)' },
        { key: '17', name: 'Brazil', size: '50x70 (mm)' },
        { key: '18', name: 'Brunei', size: '40x52 (mm)' },
        { key: '19', name: 'Bulgaria', size: '35x45 (mm)' },
        { key: '20', name: 'Burkina Faso', size: '35x45 (mm)' },
        { key: '21', name: 'Cambodia', size: '40x60 (mm)' },
        { key: '22', name: 'Cameroon', size: '45x50 (mm)' },
        { key: '23', name: 'Canada', size: '50x70 (mm)' },
        { key: '24', name: 'Chad', size: '50x50 (mm)' },
        { key: '25', name: 'Chile', size: '35x45 (mm)' },
        { key: '26', name: 'China', size: '33x48 (mm)' },
        { key: '27', name: 'Colombia', size: '15x25 (mm)' },
        { key: '28', name: 'Congo [DRC]', size: '35x45 (mm)' },
        { key: '29', name: 'Croatia', size: '35x45 (mm)' },
        { key: '30', name: 'Cyprus', size: '40x50 (mm)' },
        { key: '31', name: 'Czech Republic', size: '35x45 (mm)' },
        { key: '32', name: 'Denmark', size: '35x45 (mm)' },
        { key: '33', name: 'Djibouti', size: '35x35 (mm)' },
        { key: '34', name: 'Dominica', size: '45x35 (mm)' },
        { key: '35', name: 'Egypt', size: '40x60 (mm)' },
        { key: '36', name: 'Estonia', size: '40x50 (mm)' },
        { key: '37', name: 'Ethiopia', size: '30x40 (mm)' },
        { key: '38', name: 'Fiji', size: '35x45 (mm)' },
        { key: '39', name: 'Finland', size: '36x47 (mm)' },
        { key: '40', name: 'France', size: '35x45 (mm)' },
        { key: '41', name: 'Gabon', size: '35x45 (mm)' },
        { key: '42', name: 'Georgia', size: '35x45 (mm)' },
        { key: '43', name: 'Germany', size: '35x45 (mm)' },
        { key: '44', name: 'Ghana', size: '35x45 (mm)' },
        { key: '45', name: 'Greece', size: '40x60 (mm)' },
        { key: '46', name: 'Guinea', size: '35x45 (mm)' },
        { key: '47', name: 'Guinea-Bissau', size: '35x45 (mm)' },
        { key: '48', name: 'Guyana', size: '35x45 (mm)' },
        { key: '49', name: 'Hong Kong', size: '40x50 (mm)' },
        { key: '50', name: 'Hungary', size: '35x45 (mm)' },
        { key: '51', name: 'India', size: '51x51 (mm)' },
        { key: '52', name: 'Indonesia', size: '51x51 (mm)' },
        { key: '53', name: 'Iran', size: '20x20 (mm)' },
        { key: '54', name: 'Iraq', size: '35x45 (mm)' },
        { key: '55', name: 'Ireland', size: '35x45 (mm)' },
        { key: '56', name: 'Israel', size: '35x45 (mm)' },
        { key: '57', name: 'Italy', size: '51x51 (mm)' },
        { key: '58', name: 'Ivory Coast', size: '35x45 (mm)' },
        { key: '59', name: 'Jamaica', size: '35x45 (mm)' },
        { key: '60', name: 'Japan', size: '35x45 (mm)' },
        { key: '61', name: 'Jordan', size: '35x45 (mm)' },
        { key: '62', name: 'Kazakhstan', size: '35x45 (mm)' },
        { key: '63', name: 'Kenya', size: '35x45 (mm)' },
        { key: '64', name: 'Korea', size: '35x45 (mm)' },
        { key: '65', name: 'Kuwait', size: '40x60 (mm)' },
        { key: '66', name: 'Kyrgyzstan', size: '40x60 (mm)' },
        { key: '67', name: 'Latvia', size: '35x45 (mm)' },
        { key: '68', name: 'Lebanon', size: '35x45 (mm)' },
        { key: '69', name: 'Liberia', size: '35x45 (mm)' },
        { key: '70', name: 'Libya', size: '40x60 (mm)' },
        { key: '71', name: 'Lithuania', size: '35x45 (mm)' },
        { key: '72', name: 'Luxembourg', size: '35x45 (mm)' },
        { key: '73', name: 'Madagascar', size: '35x45 (mm)' },
        { key: '74', name: 'Malawi', size: '35x45 (mm)' },
        { key: '75', name: 'Malaysia', size: '35x50 (mm)' },
        { key: '76', name: 'Maldives', size: '35x45 (mm)' },
        { key: '77', name: 'Mali', size: '35x45 (mm)' },
        { key: '78', name: 'Malta', size: '35x45 (mm)' },
        { key: '79', name: 'Mauritius', size: '35x45 (mm)' },
        { key: '80', name: 'Mexico', size: '35x45 (mm)' },
        { key: '81', name: 'Mongolia', size: '35x45 (mm)' },
        { key: '82', name: 'Morocco', size: '35x45 (mm)' },
        { key: '83', name: 'Mozambique', size: '35x45 (mm)' },
        { key: '84', name: 'Namibia', size: '35x45 (mm)' },
        { key: '85', name: 'Nepal', size: '35x45 (mm)' },
        { key: '86', name: 'Netherlands', size: '35x45 (mm)' },
        { key: '87', name: 'New Zealand', size: '35x45 (mm)' },
        { key: '88', name: 'Nicaragua', size: '40x50 (mm)' },
        { key: '89', name: 'Nigeria', size: '35x45 (mm)' },
        { key: '90', name: 'Norway', size: '35x45 (mm)' },
        { key: '91', name: 'Oman', size: '40x60 (mm)' },
        { key: '92', name: 'Pakistan', size: '35x45 (mm)' },
        { key: '93', name: 'Panama', size: '35x45 (mm)' },
        { key: '94', name: 'Paraguay', size: '35x45 (mm)' },
        { key: '95', name: 'Peru', size: '51x51 (mm)' },
        { key: '96', name: 'Philippines', size: '30x40 (mm)' },
        { key: '97', name: 'Poland', size: '35x45 (mm)' },
        { key: '98', name: 'Portugal', size: '35x45 (mm)' },
        { key: '99', name: 'Qatar', size: '38x48 (mm)' },
        { key: '100', name: 'Russia', size: '35x45 (mm)' },
        { key: '101', name: 'Saudi Arabia', size: '51x51 (mm)' },
        { key: '102', name: 'Singapore', size: '35x45 (mm)' },
        { key: '103', name: 'South Africa', size: '51x51 (mm)' },
        { key: '104', name: 'Spain', size: '30x40 (mm)' },
        { key: '105', name: 'Thailand', size: '51x51 (mm)' },
        { key: '106', name: 'Turkey', size: '50x60 (mm)' },
        { key: '107', name: 'UAE', size: '35x45 (mm)' },
        { key: '108', name: 'UK', size: '35x45 (mm)' },
        { key: '109', name: 'USA', size: '51x51 (mm)' },
        { key: '110', name: 'Vietnam', size: '51x51 (mm)' },


    ];
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };
    const handleMenuClick = (value) => {
        const selectedCountry = menuItems.find((item) => item.key === value)?.name;
        setSelectedCountry(selectedCountry);
        let countryAspectRatio = getAspectRatioByCountry(selectedCountry);
        setAspectRatio(countryAspectRatio);
        setCropperKey(cropperKey + 1);
    };

    const handleVisitWebsite = () => {
        if (selectedCountry && countryUrlMap[selectedCountry]) {
            window.open(countryUrlMap[selectedCountry], '_blank');
        }
    };

    const getAspectRatioByCountry = (selectedCountry) => {
        let countryInfo = countriesData.find((country) => country[selectedCountry]);
        console.log(selectedCountry);
        console.log("in getaspectratio");
        console.log(countryInfo[selectedCountry]);
        if (countryInfo) {
            let [width_frame, height_frame] = countryInfo[selectedCountry].split(',').map(Number);
            return (parseFloat(width_frame) / parseFloat(height_frame));
        }
        return 1; // Default aspect ratio if country info is not found
    };

    const handleClear = () => {
        setIsLoading(false);
        setImageUrl(null);
        setDisplayUrl(null);
        setIsPreviewActive(false); // Reset the preview state
    };


    function getImageTypeFromMime(dataUrl) {
        return dataUrl.split(',')[0].split(':')[1].split(';')[0].split('/')[1];
    }

    const handleUpload = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        let uniqueId = uuidv4();
        setfileName(file.name.split('.').slice(0, -1).join('.') + '_' + uniqueId);
        reader.onload = () => {
            setImageUrl(reader.result);
            setFileType(getImageTypeFromMime(reader.result));
            setCropperKey(cropperKey + 1);
        };
        reader.onerror = (error) => {
            console.error('Error: ', error);
        };
    };

    const props = {
        name: 'file',
        accept: 'image/*',
        beforeUpload: (file) => {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                console.error('Only JPG/PNG files are allowed!');
                return false;
            }
            return true;
        },
        showUploadList: false,
        onChange: (info) => {
            if (info.file.status !== 'uploading') {
                handleUpload(info.file.originFileObj);
            }
        },
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleUpload(file);
    };
    function dataURLtoFile(dataURL, fileName) {
        // extract the MIME type and base64 data from the URL
        const mime = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const data = atob(dataURL.split(',')[1]);
        // create a new blob from the binary data and MIME type
        const array = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            array[i] = data.charCodeAt(i);
        }
        const blob = new Blob([array], { type: mime });
        const file = new File([blob], fileName, { type: mime });
        return file;
    }

    // function getImageType(dataUrl) {
    //   console.log(dataUrl)
    //   console.log("image type is :", dataUrl.split(',')[0].split(':')[1].split(';')[0]);
    //   return dataUrl.split(',')[0].split(':')[1].split(';')[0];
    // }

    function downloadImage(url1, type) {
        fetch(url1)
            .then(response => response.blob())
            .then(blob => {
                //const url = window.URL.createObjectURL(blob);
                const reader = new FileReader();
                reader.onload = () => {
                    const imageDataUrl = reader.result;
                    toast.success("Successfully processed")
                    setIsLoading(false);
                    setDisplayUrl(imageDataUrl);
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => { console.log(error); toast.error("Error encountered."); setIsLoading(false) });
    }

    function handleDownload() {
        const link = document.createElement('a');
        link.href = displayUrl;
        link.setAttribute('download', fileName + '.' + fileType);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Passport photo Successfully created");
    };

    const handlePreview = async () => {
        setIsLoading(true);
        setIsPreviewActive(true); // Set the preview state to true
        if (selectedCountry == null) {
            setIsLoading(false);
            toast.error("Please select country");
            setIsPreviewActive(true); // Set the preview state to true
            return;
        }

        const resetPreview = () => {
            setIsPreviewActive(false);
            // ... other reset logic ...
        };


        if (typeof cropperRef.current?.cropper !== "undefined") {
            //setImageUrl(cropperRef.current?.cropper?.getCroppedCanvas().toDataURL());
            console.log("image url:", imageUrl);
            console.log(cropperRef.current?.cropper?.getCroppedCanvas().toDataURL())
            const formData = new FormData();
            formData.append('myfile', dataURLtoFile(cropperRef.current?.cropper?.getCroppedCanvas().toDataURL(), fileName + '.' + fileType));
            formData.append('country', selectedCountry);
            formData.append('function', 'passport_photo_size');
            if (isChecked) {
                formData.append('background_req', 'yes');
            } else {
                formData.append('background_req', 'no');
            }
            //  axios.post(process.env.REACT_APP_API_URL+'/passport_photo_size/', formData)
            axios.post("http://xlabk8s3.cse.buffalo.edu:30010/passport_photo_size/", formData)
                .then(response => {
                    console.log(response)
                    if (response.data['face detection'].includes("No")) {
                        setIsLoading(false);
                        toast.error(response.data['face detection']);
                        return;
                    }
                    if (response?.data?.Spects_detector && !response.data['Spects_detector'].includes("not detected")) {
                        setIsLoading(false);
                        var answer = window.confirm(response.data.Spects_detector + ", Do you want to continue download?");
                        if (!answer) {
                            toast.error('Please re-upload image');
                            handleClear();
                            return;
                        }
                    }
                    if (response?.data['pose detector'] && response.data['pose detector'].includes("TILT")) {
                        var answer = window.confirm("Face is tilted, Do you want to continue with existing image?");
                        if (!answer) {
                            toast.error('Please re-upload image');
                            handleClear();
                            return;
                        }
                    }
                    downloadImage(response.data.imageUrl);
                }
                )
                .catch(error => { console.log(error); toast.error("Error encountered."); setIsLoading(false) });
        }
    };

    document.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    useEffect(() => {
        document.addEventListener('drop', handleDrop);

        // Remove event listener when component is unmounted
        return () => {
            document.removeEventListener("drop", handleDrop);
        };
    }, []);
    const info = () => {
        Modal.info({
            title: 'Passport Photo Creation',
            content: (
                <div>
                    involves creating a passport photo that meets the specific requirements of that country:
                    <ol>
                        <li>Input Image: Start by drag & drop or upload the image file.</li>

                        <li>Choose Country: Select the desired country. Each country has its own set of specifications and requirements for passport photos.</li>
                        <li>Apply High End Features: For faster processing you can uncheck the box / Check the box for applying the features.</li>


                        <li>Preview and Download: Preview and download the generated passport photo.</li>
                    </ol>
                </div>
            ),
            onOk() { },
            width: 600,
        });
    };
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider style={{ backgroundColor: '#000524' }} collapsible collapsed={collapsed} onCollapse={onCollapse}>
                {collapsed ? (
                    <CollapsedHint />
                ) : (
                    <>
                        <label style={{ color: 'white', textAlign: 'center' }}>Choose Country:</label>
                        <Select
                            showSearch
                            style={{ width: 180, marginLeft: '5px' }}
                            onChange={handleMenuClick}
                            filterOption={(input, option) =>
                                new RegExp(`^${input}`, 'i').test(option.children)
                            }
                        >
                            {menuItems.map((item) => (
                                <Option key={item.key} value={item.key}>
                                    {`${item.name.replace('_', ' ')} - ${item.size}`}
                                </Option>
                            ))}
                        </Select>


                        {/* Display text and a button to visit the website under the "Choose Country" dropdown */}
                        {selectedCountry && countryUrlMap[selectedCountry] && (
                            <div style={{ marginTop: '4px', marginLeft: '8px' }}>
                                <p style={{ color: 'white', marginBottom: '2px' }}>
                                    Check requirements here:
                                </p>
                                <Button type="primary" onClick={handleVisitWebsite}>
                                    Visit Website
                                </Button>
                            </div>
                        )}

                        <label className="labelStyle">
                            <Checkbox
                                checked={isChecked}
                                onChange={(e) => handleCheckboxChange(e)}
                                className="modern-checkbox"
                            />
                            &nbsp; Apply White Background.
                        </label>
                    </>
                )}
            </Sider>
            <Layout className="site-layout">
                <ContentSection>
                    {!imageUrl ?
                        <div className="passport-photo-container" style={{ display: 'block' }}>
                            <Fade>
                                {/* Users can convert their images into the desired format, such as JPEG, PNG, and more.
               Please select the format and upload the image in box below. */}
                                <div style={{ position: 'relative', left: '100px', top: '5rem' }}>
                                    <b>Passport Photo Creation</b> involves creating a passport photo that meets the specific requirements of that country:
                                    <ol>
                                        <li>Input Image: Start by drag & drop or upload the image file.</li>

                                        <li>Choose Country: Select the desired country. Each country has its own set of specifications and requirements for passport photos.</li>
                                        <li>Apply High End Features: For faster processing you can uncheck the box / Check the box for applying the features.</li>


                                        <li>Preview and Download: Preview and download the generated passport photo.</li>
                                    </ol>
                                </div>  </Fade>
                            <div className="center-card-container" style={{ position: 'relative', top: '50px', left: '180px' }}>
                                <div style={{ flexGrow: '1' }}>
                                    <Card className="passport-photo-card"
                                        title="Passport Photo"
                                        cover=
                                        {
                                            <div style={{ display: 'flex' }}>
                                                {imageUrl && (
                                                    <Cropper
                                                        key={cropperKey}
                                                        ref={cropperRef}
                                                        src={imageUrl}
                                                        aspectRatio={aspectRatio}
                                                        style={{ textAlign: 'center', height: 400, width: '50%', margin: '10px' }}
                                                        background={false}
                                                        cropBoxResizable={false}
                                                    />
                                                )}
                                                {displayUrl && <img className='uploaded-image' style={{ height: 400, width: '40%', marginLeft: '30px' }} src={displayUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                                            </div>
                                        }
                                        extra={
                                            <Tooltip title="More Info">
                                                <InfoCircleOutlined onClick={info} />
                                            </Tooltip>
                                        }
                                    >
                                        <Upload {...props} className="my-upload"
                                            onDrop={(e) => handleDrop(e)}
                                        >
                                            <p>
                                                <UploadOutlined />
                                                Click or drag photo to this area to upload.
                                            </p>
                                            {isLoading && <Spin indicator={antIcon} />}

                                        </Upload><br></br>
                                        {imageUrl && (
                                            <Button type="danger" onClick={handleClear} style={{ margin: '10px' }}>
                                                Clear Photo
                                            </Button>
                                        )}
                                        {imageUrl && (
                                            <Button type="primary" onClick={handlePreview} style={{ margin: '10px' }}>
                                                Preview Photo
                                            </Button>
                                        )}
                                        {displayUrl && (
                                            <Button type="success" onClick={handleDownload} style={{ margin: '10px' }}>
                                                Download Photo
                                            </Button>
                                        )}
                                    </Card>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="passport-photo-container">
                            <div className="center-card-container">
                                <div style={{ flexGrow: '1' }}>
                                    <Card className="passport-photo-card"
                                        title="Passport Photo"
                                        cover={
                                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px' }}>
                                                <div style={{ width: '45%' }}>
                                                    {imageUrl && (
                                                        <div style={{ marginBottom: '10px' }}>
                                                            {/* Zoom Controls Section */}
                                                            {/*
                                                            {!isPreviewActive && (
                                                                <div className="zoom-controls">
                                                                    <p style={{ textAlign: 'center', marginBottom: '5px', color: 'white' }}>Zoom Options</p>
                                                                    <Tooltip title="Zoom In">
                                                                        <Button className="zoom-button" onClick={zoomIn}>+</Button>
                                                                    </Tooltip>
                                                                    <Tooltip title="Zoom Out">
                                                                        <Button className="zoom-button" onClick={zoomOut}>-</Button>
                                                                    </Tooltip>
                                                                </div>
                                                            )}
                                                            */}

                                                            <Cropper
                                                                key={cropperKey}
                                                                ref={cropperRef}
                                                                src={imageUrl}
                                                                aspectRatio={aspectRatio}
                                                                style={{ height: 400 }}
                                                                background={false}
                                                                cropBoxResizable={false}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                {displayUrl && (
                                                    <img className='uploaded-image'
                                                        style={{ height: 400, maxWidth: '45%', objectFit: 'contain', marginLeft: '10px' }}
                                                        src={displayUrl}
                                                        onDragOver={(e) => e.preventDefault()}
                                                        onDrop={(e) => handleDrop(e)}
                                                    />
                                                )}
                                            </div>
                                        }
                                        extra={
                                            <Tooltip title="More Info">
                                                <InfoCircleOutlined onClick={info} />
                                            </Tooltip>
                                        }>
                                        <Upload {...props} className="my-upload"
                                            onDrop={(e) => handleDrop(e)}
                                        >
                                            <p>
                                                <UploadOutlined />
                                                Click or drag photo to this area to upload.
                                            </p>
                                            {isLoading && <Spin indicator={antIcon} />}

                                        </Upload><br></br>
                                        {imageUrl && (
                                            <Button type="danger" onClick={handleClear} style={{ margin: '10px' }}>
                                                Clear Photo
                                            </Button>
                                        )}
                                        {imageUrl && (
                                            <Button type="primary" onClick={handlePreview} style={{ margin: '10px' }}>
                                                Preview Photo
                                            </Button>
                                        )}
                                        {displayUrl && (
                                            <Button type="success" onClick={handleDownload} style={{ margin: '10px' }}>
                                                Download Photo
                                            </Button>
                                        )}
                                    </Card>
                                </div>
                            </div>
                        </div>}
                </ContentSection>
            </Layout>
        </Layout>
    );
};

export default PassportPhoto;