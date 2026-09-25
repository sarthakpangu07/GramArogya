import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
    const { i18n, t } = useTranslation();

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div className="language-selector">
            <label htmlFor="language">
                {t("language.select")}:
            </label>

            <select
                id="language"
                value={i18n.language}
                onChange={handleLanguageChange}
            >
                <option value="en">
                    {t("language.english")}
                </option>

                <option value="mr">
                    {t("language.marathi")}
                </option>

                <option value="hi">
                    {t("language.hindi")}
                </option>
            </select>
        </div>
    );
};

export default LanguageSelector;