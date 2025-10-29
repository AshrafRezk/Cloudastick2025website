// Client data for modal display
export interface ClientInfo {
  id: string;
  name: string;
  industry: string;
  description: string;
  websiteUrl?: string;
}

export const clientsData: Record<string, ClientInfo> = {
  'Afreximbank': {
    id: 'afreximbank',
    name: 'Afreximbank',
    industry: 'Fintech',
    description: 'The African Export-Import Bank is a pan-African multilateral financial institution established in 1993 to finance and promote intra- and extra-African trade. Headquartered in Cairo, Egypt, it offers trade finance, project finance, and advisory services to support the expansion and diversification of African trade.',
    websiteUrl: 'https://www.afreximbank.com'
  },
  'AIM Group': {
    id: 'aim-group',
    name: 'AIM Group',
    industry: 'Professional Services',
    description: 'AIM Group is a professional services company providing consulting and business solutions. They specialize in delivering strategic advisory services and operational excellence to help organizations achieve their business objectives.',
    websiteUrl: undefined
  },
  'Al Bedeawi & Partners': {
    id: 'al-bedeawi-partners',
    name: 'Al Bedeawi & Partners',
    industry: 'Professional Services',
    description: 'Al Bedeawi & Partners is a leading law firm providing comprehensive legal services across various practice areas. They offer expert legal counsel and representation to clients in both local and international matters.',
    websiteUrl: undefined
  },
  'Al Tayyar': {
    id: 'al-tayyar',
    name: 'Al Tayyar',
    industry: 'Travel & Hospitality',
    description: 'Al Tayyar Travel Group is one of the leading travel and tourism companies in Saudi Arabia. They provide comprehensive travel services including airline ticketing, hotel bookings, and tour packages for both business and leisure travelers.',
    websiteUrl: undefined
  },
  'ALDAU': {
    id: 'aldau',
    name: 'ALDAU',
    industry: 'Real Estate & Construction',
    description: 'ALDAU is a real estate development company focused on creating innovative residential and commercial properties. They are known for their commitment to quality construction and sustainable development practices.',
    websiteUrl: undefined
  },
  'Almosafer': {
    id: 'almosafer',
    name: 'Almosafer',
    industry: 'Travel & Hospitality',
    description: 'Almosafer is a leading online travel platform in Saudi Arabia, offering comprehensive travel booking services including flights, hotels, and vacation packages. They provide convenient digital solutions for travelers across the region.',
    websiteUrl: undefined
  },
  'Avon': {
    id: 'avon',
    name: 'Avon',
    industry: 'Healthcare',
    description: 'Avon is a global healthcare company specializing in medical products and healthcare solutions. They are committed to improving patient care through innovative medical technologies and pharmaceutical products.',
    websiteUrl: 'https://www.avon.com'
  },
  'Benoit properties': {
    id: 'benoit-properties',
    name: 'Benoit Properties',
    industry: 'Real Estate & Construction',
    description: 'Benoit Properties is a real estate development company focused on creating high-quality residential and commercial properties. They are known for their innovative design approach and commitment to sustainable development.',
    websiteUrl: undefined
  },
  'Beshay Steel': {
    id: 'beshay-steel',
    name: 'Beshay Steel',
    industry: 'Manufacturing',
    description: 'Beshay Steel is a leading steel manufacturing company producing high-quality steel products for construction and industrial applications. They are known for their advanced manufacturing processes and commitment to quality.',
    websiteUrl: undefined
  },
  'Classera': {
    id: 'classera',
    name: 'Classera',
    industry: 'Education',
    description: 'Classera is an educational technology company providing comprehensive e-learning solutions and digital education platforms. They help educational institutions transform their learning environments through innovative technology.',
    websiteUrl: 'https://www.classera.com'
  },
  'CREDOLOGOS': {
    id: 'credologos',
    name: 'CREDOLOGOS',
    industry: 'Non-profit',
    description: 'CREDOLOGOS is a non-profit organization focused on community development and social impact initiatives. They work to create positive change in communities through various social programs and development projects.',
    websiteUrl: undefined
  },
  'Deraya': {
    id: 'deraya',
    name: 'Deraya',
    industry: 'Professional Services',
    description: 'Deraya is a professional services company specializing in brokerage and financial advisory services. They provide expert guidance and solutions to help clients achieve their financial and business objectives.',
    websiteUrl: undefined
  },
  'Dorra': {
    id: 'dorra',
    name: 'Dorra',
    industry: 'Real Estate & Construction',
    description: 'Dorra is a real estate development company focused on creating premium residential and commercial properties. They are known for their innovative design concepts and commitment to quality construction.',
    websiteUrl: undefined
  },
  'Egypt Pannel': {
    id: 'egypt-pannel',
    name: 'Egypt Panel',
    industry: 'Manufacturing',
    description: 'Egypt Panel is a manufacturing company specializing in panel production and construction materials. They provide high-quality building materials and solutions for various construction and industrial applications.',
    websiteUrl: undefined
  },
  'Elaa': {
    id: 'elaa',
    name: 'Elaa',
    industry: 'Travel & Hospitality',
    description: 'Elaa is a travel and hospitality company providing comprehensive travel services and tourism solutions. They offer personalized travel experiences and hospitality services for both business and leisure travelers.',
    websiteUrl: undefined
  },
  'Erth': {
    id: 'erth',
    name: 'Erth',
    industry: 'Real Estate & Construction',
    description: 'Erth is a real estate development company focused on sustainable and innovative property development. They are committed to creating environmentally conscious and modern living spaces.',
    websiteUrl: undefined
  },
  'FAYVO': {
    id: 'fayvo',
    name: 'FAYVO',
    industry: 'Professional Services',
    description: 'FAYVO is a professional services company providing consulting and business solutions across various industries. They help organizations optimize their operations and achieve strategic business goals.',
    websiteUrl: undefined
  },
  'FedEx': {
    id: 'fedex',
    name: 'FedEx',
    industry: 'Professional Services',
    description: 'FedEx is a global logistics and transportation company providing shipping, e-commerce, and business services worldwide. They are known for their reliable delivery services and innovative logistics solutions.',
    websiteUrl: 'https://www.fedex.com'
  },
  'Fruit Nation': {
    id: 'fruit-nation',
    name: 'Fruit Nation',
    industry: 'Manufacturing',
    description: 'Fruit Nation is a food manufacturing company specializing in fruit processing and production. They create high-quality fruit products and beverages for both domestic and international markets.',
    websiteUrl: undefined
  },
  'Galina': {
    id: 'galina',
    name: 'Galina',
    industry: 'Manufacturing',
    description: 'Galina is a manufacturing company producing various industrial and consumer products. They are committed to quality manufacturing processes and innovative product development.',
    websiteUrl: undefined
  },
  'Gameness': {
    id: 'gameness',
    name: 'Gameness',
    industry: 'eCommerce',
    description: 'Gameness is an e-commerce platform specializing in gaming products and accessories. They provide a comprehensive online marketplace for gaming enthusiasts and technology products.',
    websiteUrl: undefined
  },
  'girls who code': {
    id: 'girls-who-code',
    name: 'Girls Who Code',
    industry: 'Professional Services',
    description: 'Girls Who Code is a non-profit organization focused on closing the gender gap in technology. They provide educational programs and resources to inspire and equip young women with coding skills.',
    websiteUrl: 'https://girlswhocode.com'
  },
  'Global Banding': {
    id: 'global-banding',
    name: 'Global Banding',
    industry: 'Manufacturing',
    description: 'Global Banding is a manufacturing company specializing in industrial banding and packaging solutions. They provide high-quality packaging materials and equipment for various industries.',
    websiteUrl: undefined
  },
  'Global Scales': {
    id: 'global-scales',
    name: 'Global Scales',
    industry: 'Manufacturing',
    description: 'Global Scales is a manufacturing company specializing in precision weighing equipment and measurement solutions. They provide accurate and reliable weighing systems for industrial and commercial applications.',
    websiteUrl: undefined
  },
  'HDP': {
    id: 'hdp',
    name: 'HDP',
    industry: 'Real Estate & Construction',
    description: 'HDP is a real estate development company focused on creating innovative residential and commercial properties. They are known for their modern design approach and quality construction practices.',
    websiteUrl: undefined
  },
  'IMKAN': {
    id: 'imkan',
    name: 'IMKAN',
    industry: 'Real Estate & Construction',
    description: 'IMKAN is a leading real estate development company creating innovative and sustainable communities. They are known for their commitment to quality design and environmental responsibility.',
    websiteUrl: 'https://www.imkan.ae'
  },
  'InTuition': {
    id: 'intuition',
    name: 'InTuition',
    industry: 'Education',
    description: 'InTuition is an educational technology company providing innovative learning solutions and digital education platforms. They help educational institutions enhance their teaching and learning experiences.',
    websiteUrl: undefined
  },
  'KAYAN': {
    id: 'kayan',
    name: 'KAYAN',
    industry: 'Automotive',
    description: 'KAYAN is an automotive company specializing in vehicle manufacturing and automotive solutions. They are committed to producing high-quality vehicles and automotive components.',
    websiteUrl: undefined
  },
  'Kingfisher': {
    id: 'kingfisher',
    name: 'Kingfisher',
    industry: 'eCommerce',
    description: 'Kingfisher is a leading e-commerce platform specializing in home improvement and DIY products. They provide a comprehensive online marketplace for home and garden products.',
    websiteUrl: 'https://www.kingfisher.com'
  },
  'LEGACY Ventures': {
    id: 'legacy-ventures',
    name: 'LEGACY Ventures',
    industry: 'Travel & Hospitality',
    description: 'LEGACY Ventures is a travel and hospitality company providing luxury travel experiences and hospitality services. They specialize in creating memorable travel experiences for discerning clients.',
    websiteUrl: undefined
  },
  'Live Tula': {
    id: 'live-tula',
    name: 'Live Tula',
    industry: 'Healthcare',
    description: 'Live Tula is a healthcare company focused on providing innovative health and wellness solutions. They are committed to improving patient care through technology and personalized healthcare services.',
    websiteUrl: undefined
  },
  'Marakez': {
    id: 'marakez',
    name: 'Marakez',
    industry: 'Real Estate & Construction',
    description: 'Marakez is a real estate development company specializing in creating vibrant mixed-use communities. They are known for their innovative approach to urban development and community building.',
    websiteUrl: 'https://www.marakez.com'
  },
  'Marid Coffee': {
    id: 'marid-coffee',
    name: 'Marid Coffee',
    industry: 'Manufacturing',
    description: 'Marid Coffee is a coffee manufacturing company specializing in premium coffee production and distribution. They are committed to delivering high-quality coffee products to customers worldwide.',
    websiteUrl: undefined
  },
  'meddbase': {
    id: 'meddbase',
    name: 'meddbase',
    industry: 'Healthcare',
    description: 'meddbase is a healthcare technology company providing digital health solutions and medical database services. They help healthcare providers improve patient care through innovative technology solutions.',
    websiteUrl: undefined
  },
  'Megatech Arabia': {
    id: 'megatech-arabia',
    name: 'Megatech Arabia',
    industry: 'Professional Services',
    description: 'Megatech Arabia is a technology consulting company providing IT solutions and digital transformation services. They help organizations leverage technology to achieve their business objectives.',
    websiteUrl: undefined
  },
  'Memar': {
    id: 'memar',
    name: 'Memar',
    industry: 'Real Estate & Construction',
    description: 'Memar is a real estate development company focused on creating innovative architectural solutions and sustainable developments. They are known for their modern design approach and environmental consciousness.',
    websiteUrl: undefined
  },
  'Modern Electronics': {
    id: 'modern-electronics',
    name: 'Modern Electronics',
    industry: 'Professional Services',
    description: 'Modern Electronics is a technology company specializing in electronic products and solutions. They provide innovative electronic devices and technology solutions for various industries.',
    websiteUrl: undefined
  },
  'Mozare3': {
    id: 'mozare3',
    name: 'Mozare3',
    industry: 'Manufacturing',
    description: 'Mozare3 is a manufacturing company specializing in agricultural and industrial products. They are committed to sustainable manufacturing practices and innovative product development.',
    websiteUrl: undefined
  },
  'Nile City': {
    id: 'nile-city',
    name: 'Nile City',
    industry: 'Real Estate & Construction',
    description: 'Nile City is a real estate development company focused on creating premium residential and commercial properties. They are known for their strategic locations and quality construction.',
    websiteUrl: undefined
  },
  'PadSquad': {
    id: 'padsquad',
    name: 'PadSquad',
    industry: 'eCommerce',
    description: 'PadSquad is an e-commerce platform specializing in digital products and technology solutions. They provide innovative digital products and services for modern businesses.',
    websiteUrl: undefined
  },
  'Plantform': {
    id: 'plantform',
    name: 'Plantform',
    industry: 'Manufacturing',
    description: 'Plantform is a manufacturing company specializing in industrial equipment and machinery. They provide high-quality manufacturing solutions and equipment for various industries.',
    websiteUrl: undefined
  },
  'Prosperity': {
    id: 'prosperity',
    name: 'Prosperity',
    industry: 'Real Estate & Construction',
    description: 'Prosperity is a real estate development company focused on creating prosperous communities and developments. They are committed to sustainable development and community building.',
    websiteUrl: undefined
  },
  'Reef': {
    id: 'reef',
    name: 'Reef',
    industry: 'Manufacturing',
    description: 'Reef is a manufacturing company specializing in marine and industrial products. They provide high-quality products and solutions for marine and industrial applications.',
    websiteUrl: undefined
  },
  'Rutgers': {
    id: 'rutgers',
    name: 'Rutgers',
    industry: 'Education',
    description: 'Rutgers University is a leading educational institution providing comprehensive academic programs and research opportunities. They are committed to excellence in education and innovation.',
    websiteUrl: 'https://www.rutgers.edu'
  },
  'RUTI': {
    id: 'ruti',
    name: 'RUTI',
    industry: 'eCommerce',
    description: 'RUTI is an e-commerce platform specializing in fashion and lifestyle products. They provide a comprehensive online marketplace for fashion and lifestyle items.',
    websiteUrl: undefined
  },
  'Seera': {
    id: 'seera',
    name: 'Seera',
    industry: 'Travel & Hospitality',
    description: 'Seera is a leading travel and tourism company providing comprehensive travel services and solutions. They offer innovative travel experiences and hospitality services.',
    websiteUrl: 'https://www.seera.com'
  },
  'Solver': {
    id: 'solver',
    name: 'Solver',
    industry: 'Manufacturing',
    description: 'Solver is a manufacturing company specializing in industrial solutions and equipment. They provide innovative manufacturing solutions and high-quality industrial products.',
    websiteUrl: undefined
  },
  'Soueast': {
    id: 'soueast',
    name: 'Soueast',
    industry: 'Automotive',
    description: 'Soueast is an automotive company specializing in vehicle manufacturing and automotive solutions. They are committed to producing reliable and innovative vehicles.',
    websiteUrl: undefined
  },
  'Target HR & Manpower': {
    id: 'target-hr-manpower',
    name: 'Target HR & Manpower',
    industry: 'Professional Services',
    description: 'Target HR & Manpower is a human resources company providing recruitment and staffing solutions. They help organizations find the right talent and manage their workforce effectively.',
    websiteUrl: undefined
  },
  'Tarjama': {
    id: 'tarjama',
    name: 'Tarjama',
    industry: 'Professional Services',
    description: 'Tarjama is a professional services company specializing in translation and language services. They provide high-quality translation and localization services for various industries.',
    websiteUrl: 'https://www.tarjama.com'
  },
  'The American University Cairo': {
    id: 'auc',
    name: 'The American University in Cairo',
    industry: 'Education',
    description: 'The American University in Cairo is a leading educational institution providing world-class academic programs and research opportunities. They are committed to excellence in education and cultural exchange.',
    websiteUrl: 'https://www.aucegypt.edu'
  },
  'Town Movers': {
    id: 'town-movers',
    name: 'Town Movers',
    industry: 'Real Estate & Construction',
    description: 'Town Movers is a construction and moving company providing comprehensive relocation and construction services. They help clients with smooth transitions and quality construction work.',
    websiteUrl: undefined
  },
  'TWNAF': {
    id: 'twnaf',
    name: 'TWNAF',
    industry: 'Non-profit',
    description: 'TWNAF is a non-profit organization focused on community development and social impact initiatives. They work to create positive change through various social programs and community projects.',
    websiteUrl: undefined
  },
  'Venture': {
    id: 'venture',
    name: 'Venture',
    industry: 'Travel & Hospitality',
    description: 'Venture is a travel and hospitality company providing adventure travel experiences and hospitality services. They specialize in creating unique and memorable travel experiences.',
    websiteUrl: undefined
  },
  'Wellthi': {
    id: 'wellthi',
    name: 'Wellthi',
    industry: 'Fintech',
    description: 'Wellthi is a fintech company providing innovative financial solutions and digital banking services. They are committed to making financial services more accessible and convenient.',
    websiteUrl: undefined
  },
  'World Business Council': {
    id: 'world-business-council',
    name: 'World Business Council',
    industry: 'Professional Services',
    description: 'World Business Council is a professional services organization providing business consulting and advisory services. They help organizations navigate complex business challenges and opportunities.',
    websiteUrl: undefined
  }
};
