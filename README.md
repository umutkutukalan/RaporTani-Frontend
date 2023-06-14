# *For Frontend*

## *npm install*

Klasöre giriyoruz ve indirme işlemlerini yapıyoruz.

```bash
cd RaporTani-Frontend
```

React Router Dom / React Router
```bash
npm install react-router-dom
```
Axios
```bash
npm install axios
```

** react-router-dom ‘ u App.js’ e ekliyoruz.**
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
```

### **Bootstrap Install**

Terminal ile proje’ye bootstrap’ı yüklüyoruz:
```bash
npm install bootstrap
```

Ardından alttaki kod dizimini App.js’ e tanımlıyoruz. (Bootstrap sitesinden ulaşılabilir. Kaynak kodlarda tanımlı hâldedir.)

```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

### **Browser Router, Routes, Roter**

```javascript
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Hasta />}></Route>
            <Route path='doktor' element={<Doktor />} />
            <Route path='kayıt' element={<Rapor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
```

kod dizimiyle üç sayfalık bir sayfa oluşturmuş oluyoruz. ‘index’ olarak tanımlamak projenin açılış sayfası anlamına gelirken, ‘path’ olarak tanımlamalar url’ye eşdeğer sayılmaktadır.
Değerler ‘Layout.jsx’ sayfasında girilmiştir.

### **Proxy Kolaylığı**
Örneğin ‘Rapor’ sayfası içinde,

```javascript
fetch('http://localhost:8080/api/users/potential-hasta', {
```

değeriyle verilecek olan fetch değeri,  “ package.json “ sayfası içine yazılan,

```javascript
"proxy": "http://localhost:8080"
```
kod satırından sonra;

```javascript
fetch('/api/users/potential-hasta', {
```

şeklinde değer alabilir. Paylaşılan ‘RaporTani - Frontend’ kodları buna uygun yazılmıştır.

## **Database’ye erişim**

Parametrelerimiz, backend tarafında yazdığımız parametreler ile uyuşmalıdır.

```javascript
const [selectedRapor, setSelectedRapor] = useState({
      taniBaslik: '',
      taniDetay: '',
      raporTarih: '',
      dosyaNumarasi: '',
      doktorId: 0,
      doktor: {},
      hastalar: []
    })
```

Bunun ardından örnek olarak ‘createRapor’ fonksiyonunu ele alırsak;

```javascript
function createRapor() {
      const rapor = {
          dosyaNumarasi: selectedRapor.dosyaNumarasi,
          taniBaslik: selectedRapor.taniBaslik,
          taniDetay: selectedRapor.taniDetay,
          raporTarih: selectedRapor.raporTarih,
          doktor: {
            id: Number(selectedRapor.doktorId)
          },
      }
      fetch('/api/rapor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(rapor)
        }).then((res) => res.json())
            .then((result) => {
                loadRaporlar();
                clearForm();
            });
    }

```

Fetch bağlantısı sağlanan veri tabanının ‘rapor’ tablosunda bulunan (dosyaNumarasi, taniBaslik, taniDetay, raporTarih, doktor.id) parametlerine, frentend ‘ te girilen değerler atanıyor ve bu değerlerin veri tabanına işleyişi ise ‘cors’ modunda ‘POST’ metodu ile gerçekleşiyor. 

Localhost’un (POST, PUT, DELETE..) metodlarına izin verişi backend’te yazdığımız “Configuration”  ve “Bean” anatosyanu ile sağlanıyor:

```java
@Configuration
public class CrossOriginConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer(){
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH", "OPTİONS");
            }
        };
    }
}
```


# Projeyi Başlatma
Frontend klasörüne giriyoruz.
```bash
cd RaporTani-Frontend
```

Klasöre girdikten sonra projeyi başlatıyoruz.
```
npm start
```




