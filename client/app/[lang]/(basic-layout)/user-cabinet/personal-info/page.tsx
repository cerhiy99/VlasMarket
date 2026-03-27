'use client';
import { useState, useEffect, useRef, useCallback, use } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './pagePersonal.scss';
import { Locale } from '@/i18n.config';
import TabNavigation from '../components/tabNavigation';
import { $authHost } from '@/app/http';
import { useDispatch } from 'react-redux';
import { setToken } from '@/app/store/reducers/userReducers';
import { useTranslation } from '@/context/TranslationProvider';

const API_NEW_POST = 'd104e86f6f62fede8984555ae460c707';

const PagePersonal = ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = use(params);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    deliveryType: '',
    ukrPoshtaRegion: '',
    ukrPoshtaCity: '',
    ukrPoshtaDepartment: '',
    novaPoshtaCityName: '',
    novaPoshtaCityRef: '',
    novaPoshtaStreet: '',
    novaPoshtaBuilding: '',
    novaPoshtaApartment: '',
    novaPoshtaWarehouseName: '',
    novaPoshtaWarehouseRef: '',
  });

  const [allNovaPoshtaCities, setAllNovaPoshtaCities] = useState<any[]>([]);
  const [allNovaPoshtaWarehouses, setAllNovaPoshtaWarehouses] = useState<any[]>([]);
  const [allNovaPoshtaPostomats, setAllNovaPoshtaPostomats] = useState<any[]>([]);

  const [filteredNovaPoshtaCities, setFilteredNovaPoshtaCities] = useState<any[]>([]);
  const [filteredNovaPoshtaWarehouses, setFilteredNovaPoshtaWarehouses] = useState<any[]>([]);
  const [filteredNovaPoshtaPostomats, setFilteredNovaPoshtaPostomats] = useState<any[]>([]);

  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showWarehouseSuggestions, setShowWarehouseSuggestions] = useState(false);

  const cityInputRef = useRef<HTMLInputElement>(null);
  const warehouseInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false);
      }
      if (warehouseInputRef.current && !warehouseInputRef.current.contains(event.target as Node)) {
        setShowWarehouseSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchAllNovaPoshtaCities = useCallback(async () => {
    try {
      const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: API_NEW_POST,
          modelName: 'Address',
          calledMethod: 'getCities',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAllNovaPoshtaCities(data.data);
        setFilteredNovaPoshtaCities(data.data);
      } else {
        console.error('Error fetching all Nova Poshta cities:', data.errors);
        setAllNovaPoshtaCities([]);
        setFilteredNovaPoshtaCities([]);
      }
    } catch (error) {
      console.error('Network error fetching all Nova Poshta cities:', error);
      setAllNovaPoshtaCities([]);
      setFilteredNovaPoshtaCities([]);
    }
  }, []);

  const fetchAllNovaPoshtaWarehousesByCity = useCallback(
    async (cityRef: string) => {
      if (!cityRef) {
        setAllNovaPoshtaWarehouses([]);
        setAllNovaPoshtaPostomats([]);
        setFilteredNovaPoshtaWarehouses([]);
        setFilteredNovaPoshtaPostomats([]);
        return;
      }
      try {
        const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: API_NEW_POST,
            modelName: 'AddressGeneral',
            calledMethod: 'getWarehouses',
            methodProperties: {
              CityRef: cityRef,
            },
          }),
        });
        const data = await response.json();
        if (data.success) {
          const warehouses = data.data.filter((wh: any) => wh.CategoryOfWarehouse !== 'Postomat');
          const postomats = data.data.filter((wh: any) => wh.CategoryOfWarehouse === 'Postomat');

          setAllNovaPoshtaWarehouses(warehouses);
          setAllNovaPoshtaPostomats(postomats);

          if (formData.deliveryType === t('personalPage.deliveryWarehouse')) {
            setFilteredNovaPoshtaWarehouses(warehouses);
            setFilteredNovaPoshtaPostomats([]);
          } else if (formData.deliveryType === t('personalPage.deliveryPostomat')) {
            setFilteredNovaPoshtaPostomats(postomats);
            setFilteredNovaPoshtaWarehouses([]);
          }
        } else {
          console.error('Error fetching all Nova Poshta warehouses/postomats:', data.errors);
          setAllNovaPoshtaWarehouses([]);
          setAllNovaPoshtaPostomats([]);
          setFilteredNovaPoshtaWarehouses([]);
          setFilteredNovaPoshtaPostomats([]);
        }
      } catch (error) {
        console.error('Network error fetching all Nova Poshta warehouses/postomats:', error);
        setAllNovaPoshtaWarehouses([]);
        setAllNovaPoshtaPostomats([]);
        setFilteredNovaPoshtaWarehouses([]);
        setFilteredNovaPoshtaPostomats([]);
      }
    },
    [formData.deliveryType, t]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'deliveryType') {
      setFormData((prev) => ({
        ...prev,
        ukrPoshtaRegion: '',
        ukrPoshtaCity: '',
        ukrPoshtaDepartment: '',
        novaPoshtaCityName: '',
        novaPoshtaCityRef: '',
        novaPoshtaStreet: '',
        novaPoshtaBuilding: '',
        novaPoshtaApartment: '',
        novaPoshtaWarehouseName: '',
        novaPoshtaWarehouseRef: '',
      }));
      setAllNovaPoshtaCities([]);
      setFilteredNovaPoshtaCities([]);
      setAllNovaPoshtaWarehouses([]);
      setAllNovaPoshtaPostomats([]);
      setFilteredNovaPoshtaWarehouses([]);
      setFilteredNovaPoshtaPostomats([]);
      setShowCitySuggestions(false);
      setShowWarehouseSuggestions(false);
    }
  };

  const handleChangeNumber = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      novaPoshtaCityName: value,
      novaPoshtaCityRef: '',
    }));

    let filtered: any[] = [];
    const lowercasedValue = value.toLowerCase();
    const lvivCityName = (t('personalPage.lviv') as string).toLowerCase();

    if (value) {
      filtered = allNovaPoshtaCities.filter(
        (city) =>
          city.Description.toLowerCase().includes(lowercasedValue) ||
          city.SettlementTypeDescription.toLowerCase().includes(lowercasedValue)
      );
      filtered.sort((a, b) => {
        const aDescLower = a.Description.toLowerCase();
        const bDescLower = b.Description.toLowerCase();

        if (aDescLower === lvivCityName && bDescLower !== lvivCityName) return -1;
        if (bDescLower === lvivCityName && aDescLower !== lvivCityName) return 1;

        return aDescLower.localeCompare(bDescLower);
      });
    } else {
      filtered = [...allNovaPoshtaCities];
      filtered.sort((a, b) => {
        const aDescLower = a.Description.toLowerCase();
        const bDescLower = b.Description.toLowerCase();

        if (aDescLower === lvivCityName && bDescLower !== lvivCityName) return -1;
        if (bDescLower === lvivCityName && aDescLower !== lvivCityName) return 1;

        return aDescLower.localeCompare(bDescLower);
      });
    }
    setFilteredNovaPoshtaCities(filtered);
    setShowCitySuggestions(true);
  };

  const handleCitySelect = (city: any) => {
    setFormData((prev) => ({
      ...prev,
      novaPoshtaCityName: city.Description,
      novaPoshtaCityRef: city.Ref,
      novaPoshtaWarehouseName: '',
      novaPoshtaWarehouseRef: '',
    }));
    setShowCitySuggestions(false);
    fetchAllNovaPoshtaWarehousesByCity(city.Ref);
  };

  const handleWarehouseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      novaPoshtaWarehouseName: value,
      novaPoshtaWarehouseRef: '',
    }));

    const lowercasedValue = value.toLowerCase();
    if (formData.deliveryType === t('personalPage.deliveryWarehouse')) {
      const filtered = allNovaPoshtaWarehouses.filter(
        (wh) =>
          wh.Description.toLowerCase().includes(lowercasedValue) ||
          wh.ShortAddress.toLowerCase().includes(lowercasedValue)
      );
      setFilteredNovaPoshtaWarehouses(filtered);
    } else if (formData.deliveryType === t('personalPage.deliveryPostomat')) {
      const filtered = allNovaPoshtaPostomats.filter(
        (post) =>
          post.Description.toLowerCase().includes(lowercasedValue) ||
          post.ShortAddress.toLowerCase().includes(lowercasedValue)
      );
      setFilteredNovaPoshtaPostomats(filtered);
    }
    setShowWarehouseSuggestions(true);
  };

  const handleWarehouseSelect = (warehouse: any) => {
    setFormData((prev) => ({
      ...prev,
      novaPoshtaWarehouseName: warehouse.Description,
      novaPoshtaWarehouseRef: warehouse.Ref,
    }));
    setShowWarehouseSuggestions(false);
  };
  const getPersonal = async () => {
    try {
      const res = await $authHost.get('user/getPersonal');
      if (res.data.personal.firstName) {
        setFormData(res.data.personal);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPersonal();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    const token = localStorage.getItem('token');
    const fullFormData = { ...formData, token };
    try {
      const res = await $authHost.post('user/setPeronal', fullFormData);
      dispatch(setToken(res.data.token));
      alert(t('personalPage.saveSuccess'));
    } catch (err) {
      alert(t('personalPage.saveError'));
    }
  };

  useEffect(() => {
    if (
      (formData.deliveryType === t('personalPage.deliveryCourier') ||
        formData.deliveryType === t('personalPage.deliveryWarehouse') ||
        formData.deliveryType === t('personalPage.deliveryPostomat')) &&
      allNovaPoshtaCities.length === 0
    ) {
      fetchAllNovaPoshtaCities();
    }
  }, [formData.deliveryType, allNovaPoshtaCities.length, fetchAllNovaPoshtaCities, t]);

  return (
    <div className="PagePersonal">
      <div className="PagePersonal__title">{t('personalPage.title')}</div>
      <form onSubmit={handleSubmit}>
        <div className="page-form__line">
          <div className="form-group">
            <label>
              {t('personalPage.firstName')} <span className="required">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder={t('personalPage.firstNamePlaceholder') as string}
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>
              {t('personalPage.lastName')} <span className="required">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder={t('personalPage.lastNamePlaceholder') as string}
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="page-form__line">
          <div className="form-group">
            <label>
              {t('personalPage.phone')} <span className="required">*</span>
            </label>
            <div className="phone-input-container">
              <PhoneInput
                country={'ua'}
                placeholder=""
                value={formData.phone}
                onChange={handleChangeNumber}
                inputProps={{
                  type: 'tel',
                  required: true,
                  pattern: '^\\+380 \\(\\d{2}\\\\) \\d{3} \\d{2} \\d{2}$|^(?!\\+380).{7,20}$',
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('personalPage.deliveryType')}</label>
            <select
              name="deliveryType"
              value={formData.deliveryType}
              onChange={handleChange}
              required
            >
              <option value="">{t('personalPage.notSpecified')}</option>
              <option value={t('personalPage.deliveryCourier')}>
                {t('personalPage.deliveryCourier')}
              </option>
              <option value={t('personalPage.deliveryWarehouse')}>
                {t('personalPage.deliveryWarehouse')}
              </option>
              <option value={t('personalPage.deliveryPostomat')}>
                {t('personalPage.deliveryPostomat')}
              </option>
              <option value={t('personalPage.deliveryUkrposhta')}>
                {t('personalPage.deliveryUkrposhta')}
              </option>
            </select>
          </div>
        </div>

        {formData.deliveryType === t('personalPage.deliveryUkrposhta') && (
          <div className="delivery-options">
            <h3>{t('personalPage.ukrposhtaData')}</h3>
            <div className="page-form__line">
              <div className="form-group">
                <label>
                  {t('personalPage.ukrposhtaRegion')} <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="ukrPoshtaRegion"
                  placeholder={t('personalPage.ukrposhtaRegionPlaceholder') as string}
                  value={formData.ukrPoshtaRegion}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  {t('personalPage.city')} <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="ukrPoshtaCity"
                  placeholder={t('personalPage.cityPlaceholder') as string}
                  value={formData.ukrPoshtaCity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="page-form__line">
              <div className="form-group">
                <label>
                  {t('personalPage.department')} <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="ukrPoshtaDepartment"
                  placeholder={t('personalPage.departmentPlaceholder') as string}
                  value={formData.ukrPoshtaDepartment}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {(formData.deliveryType === t('personalPage.deliveryCourier') ||
          formData.deliveryType === t('personalPage.deliveryWarehouse') ||
          formData.deliveryType === t('personalPage.deliveryPostomat')) && (
          <div className="delivery-options">
            <h3>{t('personalPage.novaPoshtaData')}</h3>
            <div className="form-group autocomplete-container" ref={cityInputRef}>
              <label>
                {t('personalPage.city')} <span className="required">*</span>
              </label>
              <input
                type="text"
                name="novaPoshtaCityName"
                placeholder={t('personalPage.cityPlaceholder') as string}
                value={formData.novaPoshtaCityName}
                onChange={handleCityInputChange}
                onFocus={() => setShowCitySuggestions(true)}
                required
              />
              {showCitySuggestions && filteredNovaPoshtaCities.length > 0 && (
                <ul className="autocomplete-suggestions">
                  {filteredNovaPoshtaCities.map((city) => (
                    <li key={city.Ref} onClick={() => handleCitySelect(city)}>
                      {city.Description} ({city.SettlementTypeDescription})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {formData.deliveryType === t('personalPage.deliveryCourier') && (
              <>
                <div className="page-form__line">
                  <div className="form-group">
                    <label>
                      {t('personalPage.street')} <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="novaPoshtaStreet"
                      placeholder={t('personalPage.streetPlaceholder') as string}
                      value={formData.novaPoshtaStreet}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      {t('personalPage.building')} <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="novaPoshtaBuilding"
                      placeholder={t('personalPage.buildingPlaceholder') as string}
                      value={formData.novaPoshtaBuilding}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="page-form__line">
                  <div className="form-group">
                    <label>{t('personalPage.apartment')}</label>
                    <input
                      type="text"
                      name="novaPoshtaApartment"
                      placeholder={t('personalPage.apartmentPlaceholder') as string}
                      value={formData.novaPoshtaApartment}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {(formData.deliveryType === t('personalPage.deliveryWarehouse') ||
              formData.deliveryType === t('personalPage.deliveryPostomat')) &&
              formData.novaPoshtaCityRef && (
                <div className="form-group autocomplete-container" ref={warehouseInputRef}>
                  <label>
                    {formData.deliveryType === t('personalPage.deliveryWarehouse')
                      ? t('personalPage.department')
                      : t('personalPage.postomat')}{' '}
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="novaPoshtaWarehouseName"
                    placeholder={
                      formData.deliveryType === (t('personalPage.deliveryWarehouse') as string)
                        ? (t('personalPage.departmentPlaceholder') as string)
                        : (t('personalPage.postomatPlaceholder') as string)
                    }
                    value={formData.novaPoshtaWarehouseName}
                    onChange={handleWarehouseInputChange}
                    onFocus={() => setShowWarehouseSuggestions(true)}
                    required
                  />
                  {showWarehouseSuggestions &&
                    ((formData.deliveryType === t('personalPage.deliveryWarehouse') &&
                      filteredNovaPoshtaWarehouses.length > 0) ||
                      (formData.deliveryType === t('personalPage.deliveryPostomat') &&
                        filteredNovaPoshtaPostomats.length > 0)) && (
                      <ul className="autocomplete-suggestions">
                        {formData.deliveryType === t('personalPage.deliveryWarehouse') &&
                          filteredNovaPoshtaWarehouses.map((warehouse) => (
                            <li
                              key={warehouse.Ref}
                              onClick={() => handleWarehouseSelect(warehouse)}
                            >
                              {warehouse.Description}
                            </li>
                          ))}
                        {formData.deliveryType === t('personalPage.deliveryPostomat') &&
                          filteredNovaPoshtaPostomats.map((postomat) => (
                            <li key={postomat.Ref} onClick={() => handleWarehouseSelect(postomat)}>
                              {postomat.Description}
                            </li>
                          ))}
                      </ul>
                    )}
                </div>
              )}
          </div>
        )}

        <div className="required">{t('personalPage.requiredFieldsHint')}&nbsp;</div>
        <div className="button__container">
          <button type="submit">{t('personalPage.saveButton')}</button>
        </div>
      </form>
      <TabNavigation lang={lang} />
    </div>
  );
};

export default PagePersonal;
