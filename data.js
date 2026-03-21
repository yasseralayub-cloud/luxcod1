// ============================================================
// LuxCod Data - Edit this file to update portfolio & testimonials
// ============================================================

const PORTFOLIO_DATA = [
  {
    id: 1,
    name_ar: "Vivid Beauty",
    name_en: "Vivid Beauty",
    desc_ar: "موقع متجر تجميل فاخر بتصميم عصري وتجربة تسوق سلسة",
    desc_en: "Luxury beauty store website with modern design and smooth shopping experience",
    category_ar: "تصميم موقع",
    category_en: "Website Design",
    url: "https://vividbeauty.github.io/-VIVID-BEAUTY/",
    color: "#c9a96e"
  },
  {
    id: 2,
    name_ar: "Yashim Spa",
    name_en: "Yashim Spa",
    desc_ar: "موقع سبا راقٍ يعكس الهدوء والفخامة مع نظام حجز متكامل",
    desc_en: "Elegant spa website reflecting tranquility and luxury with integrated booking system",
    category_ar: "صفحة هبوط",
    category_en: "Landing Page",
    url: "https://yashimspa.github.io/YASHIM-SPA/",
    color: "#8b5cf6"
  },
  {
    id: 3,
    name_ar: "Red Carpet",
    name_en: "Red Carpet",
    desc_ar: "موقع فعاليات وأحداث بتصميم جريء وعروض تفاعلية مبهرة",
    desc_en: "Events and occasions website with bold design and stunning interactive presentations",
    category_ar: "تصميم موقع",
    category_en: "Website Design",
    url: "https://redcarpetsa.github.io/REDCARPETsa/",
    color: "#ef4444"
  },
  {
    id: 4,
    name_ar: "Shaher",
    name_en: "Shaher",
    desc_ar: "منصة متقدمة بتصميم عصري وتجربة مستخدم استثنائية",
    desc_en: "Advanced platform with modern design and exceptional user experience",
    category_ar: "تصميم موقع",
    category_en: "Website Design",
    url: "https://yasseralayub-cloud.github.io/shaher/",
    color: "#06b6d4"
  }
];

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name_ar: "سارة المنصوري",
    name_en: "Sara Al-Mansouri",
    role_ar: "صاحبة متجر تجميل",
    role_en: "Beauty Store Owner",
    comment_ar: "LuxCod غيّرت مفهومي عن التصميم الرقمي. الموقع الذي صمموه لي فاق كل توقعاتي — أنيق، سريع، ويحول الزوار إلى عملاء بشكل مذهل. مبيعاتي ارتفعت بنسبة 40% في الشهر الأول!",
    comment_en: "LuxCod changed my concept of digital design. The website they designed for me exceeded all my expectations — elegant, fast, and converts visitors into clients amazingly. My sales increased by 40% in the first month!",
    stars: 5,
    avatar: "SM"
  },
  {
    id: 2,
    name_ar: "محمد الشمري",
    name_en: "Mohammed Al-Shammari",
    role_ar: "مدير شركة عقارية",
    role_en: "Real Estate Company Manager",
    comment_ar: "فريق محترف جداً وملتزم بالمواعيد. سلّموا المشروع قبل الموعد المحدد وبجودة عالية جداً. التصميم فاخر ويعكس صورة شركتنا بشكل مثالي. أنصح الجميع بالتعامل معهم.",
    comment_en: "Very professional team that meets deadlines. They delivered the project before the deadline with very high quality. The design is luxurious and perfectly reflects our company's image. I recommend everyone to work with them.",
    stars: 5,
    avatar: "MS"
  },
  {
    id: 3,
    name_ar: "نورة العتيبي",
    name_en: "Noura Al-Otaibi",
    role_ar: "مؤسسة مشروع سبا",
    role_en: "Spa Business Founder",
    comment_ar: "كنت أبحث عن وكالة تفهم رؤيتي وتترجمها إلى تصميم يعكس فخامة علامتي التجارية. LuxCod فعلت ذلك بامتياز. الموقع جميل جداً وعملائي يثنون عليه باستمرار.",
    comment_en: "I was looking for an agency that understands my vision and translates it into a design that reflects my brand's luxury. LuxCod did that excellently. The website is very beautiful and my clients constantly praise it.",
    stars: 5,
    avatar: "NA"
  },
  {
    id: 4,
    name_ar: "عبدالله القحطاني",
    name_en: "Abdullah Al-Qahtani",
    role_ar: "صاحب مطعم",
    role_en: "Restaurant Owner",
    comment_ar: "الدعم الذي تقدمه LuxCod بعد التسليم لا يُقدَّر بثمن. كلما احتجت تعديلاً أو مساعدة، كانوا موجودين فوراً. هذا ما يميزهم عن غيرهم.",
    comment_en: "The post-delivery support that LuxCod provides is invaluable. Whenever I needed a modification or help, they were immediately available. This is what sets them apart from others.",
    stars: 5,
    avatar: "AQ"
  },
  {
    id: 5,
    name_ar: "فاطمة الزهراني",
    name_en: "Fatima Al-Zahrani",
    role_ar: "مديرة تسويق رقمي",
    role_en: "Digital Marketing Manager",
    comment_ar: "تجربة رائعة من البداية إلى النهاية. الفريق استمع لكل ملاحظاتي وحولها إلى واقع. الموقع يعكس رؤيتنا بشكل مثالي وتحويل الزوار ممتاز!",
    comment_en: "Amazing experience from start to finish. The team listened to all my feedback and turned it into reality. The website perfectly reflects our vision and visitor conversion is excellent!",
    stars: 5,
    avatar: "FZ"
  },
  {
    id: 6,
    name_ar: "خالد العمري",
    name_en: "Khaled Al-Omari",
    role_ar: "صاحب شركة تكنولوجيا",
    role_en: "Tech Company Owner",
    comment_ar: "أفضل استثمار قمت به لشركتي. الموقع احترافي جداً والأداء سريع جداً. LuxCod فريق يستحق كل ثقة.",
    comment_en: "The best investment I made for my company. The website is very professional and performance is very fast. LuxCod is a team that deserves all trust.",
    stars: 5,
    avatar: "KO"
  },
  {
    id: 7,
    name_ar: "ليلى محمد",
    name_en: "Layla Mohammed",
    role_ar: "مؤسسة متجر إلكتروني",
    role_en: "E-commerce Store Founder",
    comment_ar: "موقع جميل جداً وسهل الاستخدام. العملاء يحبونه والمبيعات ارتفعت بشكل ملحوظ. شكراً LuxCod!",
    comment_en: "Beautiful and easy-to-use website. Customers love it and sales increased significantly. Thank you LuxCod!",
    stars: 5,
    avatar: "LM"
  },
  {
    id: 8,
    name_ar: "أحمد الدعيع",
    name_en: "Ahmed Al-Duaij",
    role_ar: "مستشار أعمال",
    role_en: "Business Consultant",
    comment_ar: "فريق احترافي جداً يفهم احتياجات السوق. الموقع لا يقتصر على التصميم الجميل بل يركز على التحويل والنتائج الحقيقية.",
    comment_en: "Very professional team that understands market needs. The website is not just beautiful design but focuses on conversion and real results.",
    stars: 5,
    avatar: "AD"
  },
  {
    id: 9,
    name_ar: "فهد الدوسري",
    name_en: "Fahad Al-Dosari",
    role_ar: "مالك متجر إلكتروني",
    role_en: "E-commerce Store Owner",
    comment_ar: "جودة عالية وأسعار منافسة. الموقع سريع ومتجاوب مع جميع الأجهزة. تجربة ممتازة من البداية للنهاية",
    comment_en: "High quality and competitive prices. The website is fast and responsive on all devices. Excellent experience from start to finish",
    stars: 5,
    avatar: "FD"
  },
  {
    id: 10,
    name_ar: "نورة القحطاني",
    name_en: "Noura Al-Qahtani",
    role_ar: "مديرة تسويق",
    role_en: "Marketing Manager",
    comment_ar: "صمموا لي صفحة هبوط زادت مبيعاتي 3 أضعاف! فريق مبدع ومتعاون. سأعود لهم في مشاريعي القادمة بالتأكيد",
    comment_en: "They designed a landing page that tripled my sales! Creative and cooperative team. I will definitely come back to them for my future projects",
    stars: 5,
    avatar: "NQ"
  },
  {
    id: 11,
    name_ar: "خالد الشمري",
    name_en: "Khaled Al-Shammari",
    role_ar: "صاحب شركة",
    role_en: "Company Owner",
    comment_ar: "من أفضل الوكالات الرقمية التي تعاملت معها. التصميم عصري والدعم الفني ممتاز حتى بعد إطلاق الموقع",
    comment_en: "One of the best digital agencies I've worked with. Modern design and excellent technical support even after website launch",
    stars: 5,
    avatar: "KS"
  },
  {
    id: 12,
    name_ar: "سارة العتيبي",
    name_en: "Sarah Al-Otaibi",
    role_ar: "مؤسسة مشروع",
    role_en: "Project Founder",
    comment_ar: "احترافية عالية وسرعة في التنفيذ. الموقع جاء بالضبط كما تخيلته وأكثر. شكراً لكم على العمل المتميز",
    comment_en: "High professionalism and fast execution. The website came exactly as I imagined and more. Thank you for the excellent work",
    stars: 5,
    avatar: "SE"
  }
];
