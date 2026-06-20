import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Eye,
  FileImage,
  FileText,
  ImagePlus,
  Languages,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from "lucide-react";

const templates = [
  {
    id: "bg1",
    name: { en: "Classic Floral", hi: "क्लासिक फ्लोरल" },
    image: "/assets/biodatabg1.png",
    accent: "#a40d5f",
    ratio: "1054 / 1492",
    layout: "layout-one",
    communityTags: ["universal"],
    tone: "floral",
    headerCompatibility: "standard",
    headerColor: "#b41414",
    headerShift: "0px",
  },
  {
    id: "bg2",
    name: { en: "Festive Border", hi: "फेस्टिव बॉर्डर" },
    image: "/assets/biodatabg2.png",
    accent: "#d86800",
    ratio: "1054 / 1492",
    layout: "layout-two",
    communityTags: ["universal"],
    tone: "classic",
    headerCompatibility: "standard",
    headerColor: "#b41414",
    headerShift: "0px",
  },
  {
    id: "bg3",
    name: { en: "Royal Gold", hi: "रॉयल गोल्ड" },
    image: "/assets/biodatabg3.png",
    accent: "#b79355",
    ratio: "1045 / 1505",
    layout: "layout-three",
    communityTags: ["universal"],
    tone: "royal",
    headerCompatibility: "standard",
    headerColor: "#b41414",
    headerShift: "0px",
  },
  {
    id: "peacock-emerald",
    name: { en: "Peacock Emerald Signature", hi: "पीकॉक एमरल्ड सिग्नेचर" },
    image: "/assets/template-peacock-emerald-signature-clean.png",
    accent: "#00745a",
    ratio: "1024 / 1536",
    layout: "layout-peacock",
    communityTags: ["hindu", "universal"],
    tone: "royal",
    headerCompatibility: "standard",
    headerColor: "#00745a",
    headerShift: "6px",
  },
  {
    id: "muslim-emerald",
    name: { en: "Muslim Emerald Nikah", hi: "मुस्लिम एमरल्ड निकाह" },
    image: "/assets/template-muslim-emerald-nikah-clean.png",
    accent: "#006246",
    ratio: "1024 / 1536",
    layout: "layout-arch",
    communityTags: ["muslim"],
    tone: "classic",
    headerCompatibility: "standard",
    headerColor: "#b88a2b",
    headerShift: "18px",
  },
  {
    id: "green-leaf-modern",
    name: { en: "Green Leaf Modern", hi: "ग्रीन लीफ मॉडर्न" },
    image: "/assets/template-green-leaf-modern-clean.png",
    accent: "#4d735b",
    ratio: "1024 / 1536",
    layout: "layout-leaf",
    communityTags: ["universal"],
    tone: "minimal",
    headerCompatibility: "standard",
    headerColor: "#4d735b",
    headerShift: "10px",
  },
  {
    id: "sapphire-ik-onkar",
    name: { en: "Sapphire Ik Onkar Grace", hi: "सैफायर इक ओंकार ग्रेस" },
    image: "/assets/template-sapphire-ik-onkar-grace-clean.png",
    accent: "#0b4e85",
    ratio: "1024 / 1536",
    layout: "layout-sapphire",
    communityTags: ["sikh", "universal"],
    tone: "classic",
    headerCompatibility: "standard",
    headerColor: "#0b4e85",
    headerShift: "8px",
  },
  {
    id: "minimal-lotus-gold",
    name: { en: "Minimal Lotus Gold", hi: "मिनिमल लोटस गोल्ड" },
    image: "/assets/template-minimal-lotus-gold-clean.png",
    accent: "#c08d34",
    ratio: "1024 / 1536",
    layout: "layout-lotus",
    communityTags: ["jain", "universal"],
    tone: "floral",
    headerCompatibility: "standard",
    headerColor: "#b3762c",
    headerShift: "12px",
  },
];

const copy = {
  en: {
    start: "Create your biodata",
    seeDesigns: "See our designs",
    galleryTitle: "Choose a design that feels right",
    galleryIntro: "Preview the biodata styles before you begin.",
    useDesign: "Use this design",
    back: "Back",
    next: "Next",
    compare: "Generate previews",
    choose: "Choose this design",
    finalTitle: "Final preview",
    textSize: "Change text size",
    photoSize: "Change photo size",
    addField: "Add field",
    label: "Label",
    value: "Value",
    photoUpload: "Upload photo",
    remove: "Remove",
    rishta: "Rishta",
    heroLead: "Make a beautiful marriage biodata in minutes with graceful templates, simple details, and a live preview.",
    selected: "Selected",
    comparisonTitle: "Compare your biodata in all designs",
    comparisonIntro: "Your details and photo are placed on each matching template so you can choose with clarity.",
    exportReady: "Download your biodata as PNG or PDF.",
    downloadPng: "Download PNG",
    downloadPdf: "Download PDF",
    preparing: "Preparing...",
    details: "Biodata Details",
    photo: "Photo",
    noPhoto: "Photo",
    preferred: "Preferred",
    communityTitle: "Which community do you belong to?",
    communityIntro: "This helps us show suitable headers and later prioritize matching biodata designs.",
    headerTitle: "What should appear at the top?",
    headerIntro: "Choose an invocation/header for your biodata. You can keep it blank or write your own.",
    customHeader: "Custom header",
    customHeaderPlaceholder: "Type exactly what you want to show",
    continue: "Continue",
    noHeader: "No header",
    universalNoPreference: "Universal / No preference",
    langName: "हिन्दी",
  },
  hi: {
    start: "बायोडाटा बनाएं",
    seeDesigns: "डिजाइन देखें",
    galleryTitle: "अपना पसंदीदा डिजाइन चुनें",
    galleryIntro: "शुरू करने से पहले बायोडाटा डिजाइन देखें।",
    useDesign: "यह डिजाइन चुनें",
    back: "पीछे",
    next: "आगे",
    compare: "प्रीव्यू बनाएं",
    choose: "यह डिजाइन चुनें",
    finalTitle: "अंतिम प्रीव्यू",
    textSize: "टेक्स्ट साइज बदलें",
    photoSize: "फोटो साइज बदलें",
    addField: "फील्ड जोड़ें",
    label: "लेबल",
    value: "जानकारी",
    photoUpload: "फोटो अपलोड करें",
    remove: "हटाएं",
    rishta: "रिश्ता",
    heroLead: "सुंदर टेम्पलेट, आसान फॉर्म और लाइव प्रीव्यू के साथ कुछ मिनटों में विवाह बायोडाटा बनाएं।",
    selected: "चुना हुआ",
    comparisonTitle: "सभी डिजाइन में अपना बायोडाटा देखें",
    comparisonIntro: "आपकी जानकारी और फोटो मिलते-जुलते टेम्पलेट पर लगाई जाएगी ताकि चुनाव आसान हो।",
    exportReady: "अपना बायोडाटा PNG या PDF में डाउनलोड करें।",
    downloadPng: "PNG डाउनलोड करें",
    downloadPdf: "PDF डाउनलोड करें",
    preparing: "तैयार हो रहा है...",
    details: "बायोडाटा विवरण",
    photo: "फोटो",
    noPhoto: "फोटो",
    preferred: "पसंदीदा",
    communityTitle: "आप किस समुदाय से हैं?",
    communityIntro: "इससे हम सही शीर्षक दिखाएंगे और आगे सही डिजाइन पहले दिखा पाएंगे।",
    headerTitle: "बायोडाटा के ऊपर क्या दिखना चाहिए?",
    headerIntro: "अपने बायोडाटा के लिए शीर्षक चुनें। आप इसे खाली रख सकते हैं या अपना लिख सकते हैं।",
    customHeader: "अपना शीर्षक",
    customHeaderPlaceholder: "जो दिखाना है, बिल्कुल वैसा लिखें",
    continue: "जारी रखें",
    noHeader: "शीर्षक नहीं",
    universalNoPreference: "यूनिवर्सल / कोई पसंद नहीं",
    langName: "English",
  },
};

const communities = [
  { id: "hindu", label: { en: "Hindu", hi: "हिंदू" }, hint: { en: "Ganesh, Om and Sanskrit options", hi: "गणेश, ॐ और संस्कृत विकल्प" } },
  { id: "muslim", label: { en: "Muslim", hi: "मुस्लिम" }, hint: { en: "Arabic and English Bismillah options", hi: "अरबी और अंग्रेजी बिस्मिल्लाह विकल्प" } },
  { id: "sikh", label: { en: "Sikh", hi: "सिख" }, hint: { en: "Ik Onkar options", hi: "इक ओंकार विकल्प" } },
  { id: "jain", label: { en: "Jain", hi: "जैन" }, hint: { en: "Namokar and Mahavir options", hi: "णमोकार और महावीर विकल्प" } },
  { id: "christian", label: { en: "Christian", hi: "ईसाई" }, hint: { en: "Grace and cross options", hi: "ग्रेस और क्रॉस विकल्प" } },
  { id: "universal", label: { en: "Universal / No preference", hi: "यूनिवर्सल / कोई पसंद नहीं" }, hint: { en: "Neutral headers for every design", hi: "हर डिजाइन के लिए सामान्य शीर्षक" } },
];

const headerOptions = {
  hindu: [
    { id: "hindu-ganesh-hi", value: "|| श्री गणेशाय नमः ||", mode: "invocation" },
    { id: "hindu-ganesh-en", value: "|| Shri Ganeshaya Namah ||", mode: "invocation" },
    { id: "hindu-om", value: "ॐ", mode: "invocation" },
  ],
  muslim: [
    { id: "muslim-bismillah-ar", value: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ", mode: "invocation" },
    { id: "muslim-bismillah-en", value: "Bismillah-ir-Rahman-ir-Rahim", mode: "invocation" },
    { id: "muslim-bismillah-short", value: "بسم الله", mode: "invocation" },
  ],
  sikh: [
    { id: "sikh-ik-onkar", value: "ੴ", mode: "invocation" },
    { id: "sikh-satnam", value: "ੴ ਸਤਿ ਨਾਮੁ", mode: "invocation" },
    { id: "sikh-english", value: "Ik Onkar", mode: "invocation" },
  ],
  jain: [
    { id: "jain-arihantanam", value: "|| णमो अरिहंताणं ||", mode: "invocation" },
    { id: "jain-mahavir", value: "|| श्री महावीराय नमः ||", mode: "invocation" },
    { id: "jain-english", value: "Namo Arihantanam", mode: "invocation" },
  ],
  christian: [
    { id: "christian-grace", value: "With God's Grace", mode: "invocation" },
    { id: "christian-trinity", value: "In the name of the Father, Son and Holy Spirit", mode: "invocation" },
    { id: "christian-cross", value: "✝", mode: "invocation" },
  ],
  universal: [
    { id: "universal-none", value: "", mode: "none", labelKey: "noHeader" },
    { id: "universal-biodata", value: "BIODATA", mode: "title" },
    { id: "universal-marriage", value: "Marriage Biodata", mode: "title" },
  ],
};

const sections = [
  {
    id: "personal",
    title: { en: "Personal", hi: "व्यक्तिगत" },
    fields: [
      ["name", "Name", "नाम"],
      ["dob", "DOB", "जन्म तिथि"],
      ["age", "Age", "आयु"],
      ["caste", "Caste", "जाति"],
      ["rashi", "Rashi", "राशि"],
      ["gotra", "Gotra", "गोत्र"],
      ["complexion", "Complexion", "रंग"],
      ["qualification", "Qualification", "योग्यता"],
      ["occupation", "Occupation", "व्यवसाय"],
    ],
  },
  {
    id: "family",
    title: { en: "Family", hi: "परिवार" },
    fields: [
      ["fatherName", "Father's name", "पिता का नाम"],
      ["fatherOccupation", "Father's occupation", "पिता का व्यवसाय"],
      ["motherName", "Mother's name", "माता का नाम"],
      ["motherOccupation", "Mother's occupation", "माता का व्यवसाय"],
      ["brothers", "Brothers", "भाई"],
      ["sisters", "Sisters", "बहनें"],
    ],
  },
  {
    id: "contact",
    title: { en: "Contact", hi: "संपर्क" },
    fields: [
      ["phone", "Phone number", "फोन नंबर"],
      ["email", "Email ID", "ईमेल आईडी"],
      ["address", "Address", "पता"],
    ],
  },
  {
    id: "photo",
    title: { en: "Photo", hi: "फोटो" },
    fields: [],
  },
];

function createInitialFields() {
  return sections.flatMap((section) =>
    section.fields.map(([id, en, hi]) => ({
      id,
      section: section.id,
      label: { en, hi },
      value: "",
      visible: true,
      custom: false,
    })),
  );
}

function resolveHeader(header, customHeader) {
  if (!header) return headerOptions.universal[0];
  if (header.custom) {
    return {
      id: "custom",
      value: customHeader.trim(),
      mode: customHeader.trim() ? "invocation" : "none",
      custom: true,
    };
  }
  return header;
}

function getHeaderChoices(communityId, t) {
  const presets = headerOptions[communityId] || headerOptions.universal;
  return [
    ...presets.map((option) => ({
      ...option,
      display: option.labelKey ? t[option.labelKey] : option.value,
    })),
    { id: "custom", value: "", mode: "invocation", custom: true, display: t.customHeader },
  ];
}

function getOrderedTemplates(selectedCommunity) {
  return templates.filter((template) => {
    const tags = template.communityTags || [];
    return tags.includes(selectedCommunity) || tags.includes("universal");
  }).sort((first, second) => {
    const score = (template) => {
      if (template.communityTags?.includes(selectedCommunity)) return 0;
      if (template.communityTags?.includes("universal")) return 1;
      return 2;
    };
    return score(first) - score(second);
  });
}

function App() {
  const [language, setLanguage] = useState("en");
  const [screen, setScreen] = useState("landing");
  const [activeStep, setActiveStep] = useState("personal");
  const [preferredTemplate, setPreferredTemplate] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [selectedCommunity, setSelectedCommunity] = useState("universal");
  const [selectedHeader, setSelectedHeader] = useState(headerOptions.universal[0]);
  const [customHeader, setCustomHeader] = useState("");
  const [fields, setFields] = useState(createInitialFields);
  const [photo, setPhoto] = useState("");
  const [textScale, setTextScale] = useState(1);
  const [photoScale, setPhotoScale] = useState(1);
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);

  const visibleFields = fields.filter((field) => field.visible && field.value.trim());
  const currentStepIndex = sections.findIndex((section) => section.id === activeStep);

  function updateField(id, patch) {
    setFields((current) => current.map((field) => (field.id === id ? { ...field, ...patch } : field)));
  }

  function moveField(id, direction) {
    setFields((current) => {
      const index = current.findIndex((field) => field.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      if (current[index].section !== current[target].section) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function addCustomField(sectionId) {
    const id = `custom-${Date.now()}`;
    setFields((current) => [
      ...current,
      {
        id,
        section: sectionId,
        label: { en: "", hi: "" },
        value: "",
        visible: true,
        custom: true,
      },
    ]);
  }

  function removeField(id) {
    setFields((current) =>
      current.map((field) => (field.id === id ? { ...field, visible: false, value: "" } : field)),
    );
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  function startMaker(templateId = null) {
    if (templateId) {
      setPreferredTemplate(templateId);
      setSelectedTemplate(templateId);
    }
    setActiveStep("personal");
    setScreen("community");
  }

  function chooseCommunity(communityId) {
    const defaultHeader = headerOptions[communityId]?.[0] || headerOptions.universal[0];
    setSelectedCommunity(communityId);
    setSelectedHeader(defaultHeader);
    setCustomHeader("");
    setScreen("header");
  }

  function continueFromHeader() {
    setActiveStep("personal");
    setScreen("form");
  }

  function goToNextStep() {
    if (currentStepIndex < sections.length - 1) {
      setActiveStep(sections[currentStepIndex + 1].id);
    } else {
      setScreen("compare");
    }
  }

  function goToPreviousStep() {
    if (currentStepIndex > 0) {
      setActiveStep(sections[currentStepIndex - 1].id);
    } else {
      setScreen("header");
    }
  }

  function chooseTemplate(templateId) {
    setSelectedTemplate(templateId);
    setScreen("final");
  }

  return (
    <main className={`app lang-${language}`}>
      {screen === "landing" && (
        <Landing
          t={t}
          language={language}
          setLanguage={setLanguage}
          onStart={() => startMaker()}
          onDesigns={() => setScreen("gallery")}
        />
      )}

      {screen === "gallery" && (
        <Gallery
          t={t}
          language={language}
          preferredTemplate={preferredTemplate}
          onBack={() => setScreen("landing")}
          onUse={startMaker}
        />
      )}

      {screen === "community" && (
        <CommunitySelection
          t={t}
          language={language}
          selectedCommunity={selectedCommunity}
          onBack={() => setScreen(preferredTemplate ? "gallery" : "landing")}
          onChoose={chooseCommunity}
        />
      )}

      {screen === "header" && (
        <HeaderSelection
          t={t}
          language={language}
          selectedCommunity={selectedCommunity}
          selectedHeader={selectedHeader}
          setSelectedHeader={setSelectedHeader}
          customHeader={customHeader}
          setCustomHeader={setCustomHeader}
          onBack={() => setScreen("community")}
          onNext={continueFromHeader}
        />
      )}

      {screen === "form" && (
        <FormFlow
          t={t}
          language={language}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          currentStepIndex={currentStepIndex}
          fields={fields}
          updateField={updateField}
          moveField={moveField}
          addCustomField={addCustomField}
          removeField={removeField}
          handlePhoto={handlePhoto}
          photo={photo}
          onBack={goToPreviousStep}
          onNext={goToNextStep}
        />
      )}

      {screen === "compare" && (
        <Comparison
          t={t}
          language={language}
          fields={visibleFields}
          photo={photo}
          preferredTemplate={preferredTemplate}
          selectedCommunity={selectedCommunity}
          selectedHeader={resolveHeader(selectedHeader, customHeader)}
          onBack={() => setScreen("form")}
          onChoose={chooseTemplate}
        />
      )}

      {screen === "final" && (
        <FinalPreview
          t={t}
          language={language}
          fields={visibleFields}
          photo={photo}
          template={templates.find((item) => item.id === selectedTemplate)}
          selectedHeader={resolveHeader(selectedHeader, customHeader)}
          textScale={textScale}
          photoScale={photoScale}
          setTextScale={setTextScale}
          setPhotoScale={setPhotoScale}
          onBack={() => setScreen("compare")}
        />
      )}
    </main>
  );
}

function LanguageButton({ t, language, setLanguage }) {
  return (
    <button
      className="language-button"
      type="button"
      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
      aria-label="Change language"
    >
      <Languages size={17} />
      <span>{t.langName}</span>
    </button>
  );
}

function Landing({ t, language, setLanguage, onStart, onDesigns }) {
  return (
    <section className="landing">
      <div className="topbar">
        <img className="brand-mark" src="/assets/rishta-logo-transparent.png" alt="Rishta" />
        <LanguageButton t={t} language={language} setLanguage={setLanguage} />
      </div>

      <div className="hero-band">
        <div className="hero-copy">
          <img className="hero-logo" src="/assets/rishta-logo-transparent.png" alt="Rishta logo" />
          <h1>{t.rishta}</h1>
          <p>{t.heroLead}</p>
          <div className="hero-actions">
            <button className="primary-action" type="button" onClick={onStart}>
              <Sparkles size={18} />
              {t.start}
            </button>
            <button className="secondary-action" type="button" onClick={onDesigns}>
              <Eye size={18} />
              {t.seeDesigns}
            </button>
          </div>
        </div>
        <div className="hero-preview" aria-hidden="true">
          <BiodataPreview
            template={templates[2]}
            language={language}
            fields={sampleFields(language)}
            photo=""
            compact
          />
        </div>
      </div>
    </section>
  );
}

function Gallery({ t, language, preferredTemplate, onBack, onUse }) {
  return (
    <section className="page-shell">
      <PageHeader title={t.galleryTitle} intro={t.galleryIntro} onBack={onBack} backLabel={t.back} />
      <div className="template-grid gallery-grid">
        {templates.map((template) => (
          <article className="template-card" key={template.id}>
            <div className="template-card-preview">
              <BiodataPreview
                template={template}
                language={language}
                fields={sampleFields(language)}
                photo=""
                compact
              />
            </div>
            <div className="template-card-footer">
              <div>
                <h2>{template.name[language]}</h2>
                <TemplateTags template={template} language={language} />
                {preferredTemplate === template.id && <span className="mini-tag">{t.preferred}</span>}
              </div>
              <button className="small-primary" type="button" onClick={() => onUse(template.id)}>
                {t.useDesign}
                <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CommunitySelection({ t, language, selectedCommunity, onBack, onChoose }) {
  return (
    <section className="page-shell choice-shell">
      <PageHeader title={t.communityTitle} intro={t.communityIntro} onBack={onBack} backLabel={t.back} />
      <div className="choice-grid">
        {communities.map((community) => (
          <button
            className={`choice-card ${selectedCommunity === community.id ? "selected" : ""}`}
            type="button"
            key={community.id}
            onClick={() => onChoose(community.id)}
          >
            <span>{community.label[language]}</span>
            <small>{community.hint[language]}</small>
            {selectedCommunity === community.id && <Check size={18} />}
          </button>
        ))}
      </div>
    </section>
  );
}

function HeaderSelection({
  t,
  language,
  selectedCommunity,
  selectedHeader,
  setSelectedHeader,
  customHeader,
  setCustomHeader,
  onBack,
  onNext,
}) {
  const choices = getHeaderChoices(selectedCommunity, t);
  const community = communities.find((item) => item.id === selectedCommunity);
  const currentHeader = resolveHeader(selectedHeader, customHeader);
  const previewFields = sampleFields(language);

  return (
    <section className="page-shell header-choice-shell">
      <PageHeader title={t.headerTitle} intro={t.headerIntro} onBack={onBack} backLabel={t.back} />
      <div className="header-choice-layout">
        <div className="header-options-panel">
          {community && <div className="choice-context">{community.label[language]}</div>}
          <div className="header-option-list">
            {choices.map((option) => (
              <button
                className={`header-option ${selectedHeader?.id === option.id ? "selected" : ""}`}
                type="button"
                key={option.id}
                onClick={() => setSelectedHeader(option)}
              >
                <span>{option.display}</span>
                {selectedHeader?.id === option.id && <Check size={17} />}
              </button>
            ))}
          </div>

          {selectedHeader?.custom && (
            <label className="custom-header-field">
              <span>{t.customHeader}</span>
              <input
                value={customHeader}
                placeholder={t.customHeaderPlaceholder}
                onChange={(event) => setCustomHeader(event.target.value)}
                autoFocus
              />
            </label>
          )}

          <div className="form-actions header-actions">
            <button className="secondary-action" type="button" onClick={onBack}>
              <ArrowLeft size={17} />
              {t.back}
            </button>
            <button className="primary-action" type="button" onClick={onNext}>
              {t.continue}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        <div className="header-live-preview">
          <BiodataPreview
            template={templates[2]}
            language={language}
            fields={previewFields}
            photo=""
            selectedHeader={currentHeader}
            compact
          />
        </div>
      </div>
    </section>
  );
}

function FormFlow({
  t,
  language,
  activeStep,
  setActiveStep,
  currentStepIndex,
  fields,
  updateField,
  moveField,
  addCustomField,
  removeField,
  handlePhoto,
  photo,
  onBack,
  onNext,
}) {
  const activeSection = sections.find((section) => section.id === activeStep);
  const sectionFields = fields.filter((field) => field.section === activeStep && field.visible);

  return (
    <section className="maker-shell">
      <div className="maker-panel">
        <div className="maker-heading">
          <button className="icon-button" type="button" onClick={onBack} aria-label={t.back}>
            <ArrowLeft size={19} />
          </button>
          <div>
            <h1>{activeSection.title[language]}</h1>
            <p>{currentStepIndex + 1} / {sections.length}</p>
          </div>
        </div>

        <div className="step-tabs">
          {sections.map((section) => (
            <button
              type="button"
              className={section.id === activeStep ? "active" : ""}
              key={section.id}
              onClick={() => setActiveStep(section.id)}
            >
              {section.title[language]}
            </button>
          ))}
        </div>

        {activeStep !== "photo" ? (
          <div className="field-stack">
            {sectionFields.map((field, index) => (
              <div className="field-row" key={field.id}>
                <div className="field-inputs">
                  {field.custom ? (
                    <input
                      value={field.label[language]}
                      placeholder={t.label}
                      onChange={(event) =>
                        updateField(field.id, {
                          label: { ...field.label, [language]: event.target.value },
                        })
                      }
                    />
                  ) : (
                    <label>{field.label[language]}</label>
                  )}
                  <input
                    value={field.value}
                    placeholder={field.custom ? t.value : field.label[language]}
                    onChange={(event) => updateField(field.id, { value: event.target.value })}
                  />
                </div>
                <div className="row-tools">
                  <button type="button" aria-label="Move up" onClick={() => moveField(field.id, -1)} disabled={index === 0}>
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    onClick={() => moveField(field.id, 1)}
                    disabled={index === sectionFields.length - 1}
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button type="button" aria-label={t.remove} onClick={() => removeField(field.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}

            <button className="add-field-button" type="button" onClick={() => addCustomField(activeStep)}>
              <Plus size={17} />
              {t.addField}
            </button>
          </div>
        ) : (
          <div className="photo-upload-panel">
            <label className="photo-drop">
              {photo ? <img src={photo} alt={t.photo} /> : <ImagePlus size={42} />}
              <span>{t.photoUpload}</span>
              <input type="file" accept="image/*" onChange={handlePhoto} />
            </label>
          </div>
        )}

        <div className="form-actions">
          <button className="secondary-action" type="button" onClick={onBack}>
            <ArrowLeft size={17} />
            {t.back}
          </button>
          <button className="primary-action" type="button" onClick={onNext}>
            {currentStepIndex === sections.length - 1 ? t.compare : t.next}
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

function Comparison({ t, language, fields, photo, preferredTemplate, selectedCommunity, selectedHeader, onBack, onChoose }) {
  const orderedTemplates = getOrderedTemplates(selectedCommunity);

  return (
    <section className="page-shell comparison-shell">
      <PageHeader title={t.comparisonTitle} intro={t.comparisonIntro} onBack={onBack} backLabel={t.back} />
      <div className="template-grid compare-grid">
        {orderedTemplates.map((template) => (
          <article className="template-card compare-card" key={template.id}>
            <div className="template-card-preview">
              <BiodataPreview
                template={template}
                language={language}
                fields={fields}
                photo={photo}
                selectedHeader={selectedHeader}
                compact
              />
            </div>
            <div className="template-card-footer">
              <div>
                <h2>{template.name[language]}</h2>
                <TemplateTags template={template} language={language} />
                {preferredTemplate === template.id && <span className="mini-tag">{t.preferred}</span>}
              </div>
              <button className="small-primary" type="button" onClick={() => onChoose(template.id)}>
                <Check size={16} />
                {t.choose}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinalPreview({
  t,
  language,
  fields,
  photo,
  template,
  selectedHeader,
  textScale,
  photoScale,
  setTextScale,
  setPhotoScale,
  onBack,
}) {
  const previewRef = useRef(null);
  const [exporting, setExporting] = useState("");
  const fileBase = `${template.name.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "biodata"}`;

  async function capturePreview() {
    if (!previewRef.current) return null;
    await document.fonts?.ready;
    return html2canvas(previewRef.current, {
      backgroundColor: "#ffffff",
      scale: 3,
      useCORS: true,
      logging: false,
    });
  }

  async function downloadPng() {
    setExporting("png");
    try {
      const canvas = await capturePreview();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `${fileBase}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setExporting("");
    }
  }

  async function downloadPdf() {
    setExporting("pdf");
    try {
      const canvas = await capturePreview();
      if (!canvas) return;
      const image = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
        compress: true,
      });
      pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${fileBase}.pdf`);
    } finally {
      setExporting("");
    }
  }

  return (
    <section className="final-shell">
      <div className="final-toolbar">
        <button className="icon-button" type="button" onClick={onBack} aria-label={t.back}>
          <ArrowLeft size={19} />
        </button>
        <div>
          <h1>{t.finalTitle}</h1>
          <p>{template.name[language]} · {t.exportReady}</p>
        </div>
      </div>
      <div className="final-workspace">
        <div className="large-preview-wrap" ref={previewRef}>
          <BiodataPreview
            template={template}
            language={language}
            fields={fields}
            photo={photo}
            selectedHeader={selectedHeader}
            textScale={textScale}
            photoScale={photoScale}
          />
        </div>
        <aside className="control-panel">
          <div className="control-title">
            <SlidersHorizontal size={18} />
            <span>{language === "hi" ? "समायोजन" : "Adjustments"}</span>
          </div>
          <div className="download-actions">
            <button className="download-button" type="button" onClick={downloadPng} disabled={Boolean(exporting)}>
              <FileImage size={17} />
              {exporting === "png" ? t.preparing : t.downloadPng}
            </button>
            <button className="download-button" type="button" onClick={downloadPdf} disabled={Boolean(exporting)}>
              <FileText size={17} />
              {exporting === "pdf" ? t.preparing : t.downloadPdf}
            </button>
          </div>
          <label>
            <span>{t.textSize}</span>
            <input
              type="range"
              min="0.72"
              max="1.14"
              step="0.02"
              value={textScale}
              onChange={(event) => setTextScale(Number(event.target.value))}
            />
          </label>
          <label>
            <span>{t.photoSize}</span>
            <input
              type="range"
              min="0.72"
              max="1.18"
              step="0.02"
              value={photoScale}
              onChange={(event) => setPhotoScale(Number(event.target.value))}
            />
          </label>
        </aside>
      </div>
    </section>
  );
}

function BiodataPreview({
  template,
  language,
  fields,
  photo,
  selectedHeader,
  textScale = 1,
  photoScale = 1,
  compact = false,
}) {
  const visible = fields.length ? fields : sampleFields(language);
  const grouped = {
    personal: visible.filter((field) => field.section === "personal" || !field.section),
    family: visible.filter((field) => field.section === "family"),
    contact: visible.filter((field) => field.section === "contact"),
  };
  const longValueCount = visible.filter((field) => field.value.length > 28).length;
  const densityScore = visible.length + longValueCount * 0.7 + Math.max(0, grouped.personal.length - 7) * 0.9;
  const density = compact ? "density-compact" : densityScore > 18 ? "density-extra" : densityScore > 13 ? "density-dense" : "density-normal";
  const baseFont = compact ? 0.92 : textScale;
  const densityTextMultiplier = density === "density-extra" ? 0.9 : density === "density-dense" ? 0.96 : 1;
  const densityPhotoMultiplier = density === "density-extra" ? 0.74 : density === "density-dense" ? 0.88 : 1;
  const safeFont = Math.max(0.78, Math.min(baseFont * densityTextMultiplier, 1.14));
  const safePhotoScale = Math.max(0.62, Math.min(photoScale * densityPhotoMultiplier, 1.18));
  const fallbackHeader = {
    id: "fallback",
    value: language === "hi" ? "|| श्री गणेशाय नमः ||" : "|| Shri Ganeshaya Namah ||",
    mode: "invocation",
  };
  const header = selectedHeader || fallbackHeader;
  const title = header.mode === "title" && header.value ? header.value : language === "hi" ? "बायोडाटा" : "BIODATA";
  const invocation = header.mode === "invocation" ? header.value : "";
  const hasInvocation = Boolean(invocation.trim());

  return (
    <div className={`biodata-frame ${template.layout} ${density} ${compact ? "compact-preview" : ""}`} style={{ aspectRatio: template.ratio }}>
      <img className="biodata-bg" src={template.image} alt="" />
      <div
        className="biodata-overlay"
        style={{
          "--accent": template.accent,
          "--header-color": template.headerColor || "#b41414",
          "--header-shift": template.headerShift || "0px",
          "--scale": safeFont,
          "--photo-scale": safePhotoScale,
        }}
      >
        <div className={`biodata-header ${hasInvocation ? "" : "no-invocation"}`}>
          {hasInvocation && <div className="biodata-topline">{invocation}</div>}
          <h2>{title}</h2>
          <div className="biodata-rule" />
        </div>

        <div className="personal-layout">
          <BiodataSection
            type="personal"
            title={language === "hi" ? "व्यक्तिगत विवरण" : "PERSONAL DETAILS"}
            fields={grouped.personal}
            language={language}
          />
          <div className="photo-box">
            {photo ? <img src={photo} alt="" /> : <span>{language === "hi" ? "फोटो" : "Photo"}</span>}
          </div>
        </div>

        <BiodataSection
          type="family"
          title={language === "hi" ? "पारिवारिक विवरण" : "FAMILY DETAILS"}
          fields={grouped.family}
          language={language}
        />

        <BiodataSection
          type="contact"
          title={language === "hi" ? "संपर्क विवरण" : "CONTACT DETAILS"}
          fields={grouped.contact}
          language={language}
        />
      </div>
    </div>
  );
}

function BiodataSection({ title, fields, language, type }) {
  if (!fields.length) return null;

  return (
    <section className={`biodata-section ${type}`}>
      <h3>{title}</h3>
      <DetailRows fields={fields} language={language} />
    </section>
  );
}

function DetailRows({ fields, language }) {
  return (
    <div className="detail-rows">
      {fields.map((field) => {
        const label = field.label[language] || field.label.en || field.label.hi;
        return (
          <div className="detail-line" key={field.id}>
            <strong>{label}</strong>
            <em>:</em>
            <span>{field.value}</span>
          </div>
        );
      })}
    </div>
  );
}

function TemplateTags({ template, language }) {
  const labels = {
    hindu: { en: "Hindu", hi: "हिंदू" },
    muslim: { en: "Muslim", hi: "मुस्लिम" },
    sikh: { en: "Sikh", hi: "सिख" },
    jain: { en: "Jain", hi: "जैन" },
    christian: { en: "Christian", hi: "ईसाई" },
    universal: { en: "Universal", hi: "यूनिवर्सल" },
  };

  return (
    <div className="template-tags" aria-label="Template labels">
      {(template.communityTags || []).map((tag) => (
        <span key={tag}>{labels[tag]?.[language] || tag}</span>
      ))}
    </div>
  );
}

function PageHeader({ title, intro, onBack, backLabel }) {
  return (
    <header className="page-header">
      <button className="icon-button" type="button" onClick={onBack} aria-label={backLabel}>
        <ArrowLeft size={19} />
      </button>
      <div>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </header>
  );
}

function sampleFields(language) {
  const samples = language === "hi"
    ? [
        ["name", "personal", "नाम", "आर्या शर्मा"],
        ["dob", "personal", "जन्म तिथि", "12 मई 1998"],
        ["qualification", "personal", "योग्यता", "एम.बी.ए."],
        ["occupation", "personal", "व्यवसाय", "सॉफ्टवेयर इंजीनियर"],
        ["fatherName", "family", "पिता का नाम", "श्री राजेश शर्मा"],
        ["motherName", "family", "माता का नाम", "श्रीमती कविता शर्मा"],
        ["phone", "contact", "फोन नंबर", "+91 98765 43210"],
        ["address", "contact", "पता", "जयपुर, राजस्थान"],
      ]
    : [
        ["name", "personal", "Name", "Aarya Sharma"],
        ["dob", "personal", "DOB", "12 May 1998"],
        ["qualification", "personal", "Qualification", "MBA"],
        ["occupation", "personal", "Occupation", "Software Engineer"],
        ["fatherName", "family", "Father's name", "Mr. Rajesh Sharma"],
        ["motherName", "family", "Mother's name", "Mrs. Kavita Sharma"],
        ["phone", "contact", "Phone number", "+91 98765 43210"],
        ["address", "contact", "Address", "Jaipur, Rajasthan"],
      ];

  return samples.map(([id, section, label, value]) => ({
    id,
    section,
    label: { en: label, hi: label },
    value,
    visible: true,
  }));
}

export default App;
