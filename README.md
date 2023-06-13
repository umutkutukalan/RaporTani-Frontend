*FOR BACKEND* 
Gerekli Java SDK
- Java JDK 17
Proje Yönetimi ve Derlemesi
- Maven

## **DATABASE**

### *MySQL*(Projemdeki kodları temsili bağlayışım.)
Projemde MySQL Database’yi kullandım. Spring Projesini MySQL’e bağlamak için;

``` 
spring.jpa.hibernate.ddl-auto = update
spring.datasource.url = jdbc:mysql://localhost:3306/Kendi Schema’nızın adı yazılacak
spring.datasource.username = root // Kendi kullanıcı adınızı yazınız
spring.datasource.password = //Database’ye giriş şifrenizi yazının
spring.datasource.driver-class-name = com.mysql.cj.jdbc.Driver
```

Örneğin Schema ismimi ‘RaporTani’ adında oluşturursam;

```
spring.datasource.url = jdbc:mysql://localhost:3306/RaporTani
```

Schema ismini, kullanıcı adını ve şifreyi doğru girdikten sonra MySQL için bağlantı koordinesi oluşmuş oluyor. Spring Security xml. dosyamızda bulunduğu için ve Token işlemi gerçekleştirmediğimiz için, (pom.xml) dosyamızda ki Security Dependency’leri yorum satıları içine alalım;
 
``` 
<!--		<dependency>-->
		<!--			<groupId>org.springframework.boot</groupId>-->
		<!--			<artifactId>spring-boot-starter-security</artifactId>-->
<!--		</dependency>--> 

<!--		<dependency>-->
		<!--			<groupId>org.springframework.security</groupId>-->
		<!--			<artifactId>spring-security-test</artifactId>-->
		<!--			<scope>test</scope>-->
<!--		</dependency> —> 
```

Böylelikle güvenlik duvarını kaldırıp hatasız bir şekilde Veri Tabanı bağlantısı gerçekleşecektir. Bu işlemlerin ardından kod diziminde verilen;
 
```
@Entity
@Table(name = "doktor")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Doktor {
```

 Doktor sınıfının @Table( name = ‘doktor’) olarak tanımlanışı Veri Tabanında 'doktor’  tablosunu oluşturmaya yarayacaktır. Aynı şekilde;
 
```
@Column(name = "hastane_kimlik", length = 7)
    private String hastaneKimlik;
```

‘Column’ adı altında tanımlanan ’name’ ise tablonun içinde oluşacak olan, parametreye verilen değerin veri tabanında ulaşacağı yeri gösterir. Kodlarda geçerli değerleri kullanabilecek olduğunuz gibi isim değişikliğine gitmek istediğinizde bu değerlerle oynamanız yeterli olacaktır.


### *H2 Database*

```
<dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
			<scope>runtime</scope>
</dependency>
```

(pom.xml) dosyanımıza eklediğimiz bu dependency ile ‘localhost’ üzerinden Table vo Column değerleri atadığımız değerlere ulaşabiliriz. Spring kodlarını çalıştırdıktan sonra gelen H2 Console söz diziminin yanında çıkacak olan;

```
```
```
H2 console available at '/h2-console'. Database available at 'jdbc:h2:mem:e0b577d6-6828-4484-8b28-5440f50e6e93'
```

http://localhost:8080 bağlantısında olan projemize ‘h2-console’ eklentisini de yaparak;
http://localhost:8080/h2-console sayfasına tarayıcıdan giriş yapıyoruz.

Açılan Login sayfasının ‘ JDBC URL ‘ sine ,

```
Database available at 'jdbc:h2:mem:e0b577d6-6828-4484-8b28-5440f50e6e93'
```

kısmında gelen jdbc:h2:mem değerini bir bütün şeklinde yazıp, username değerini de;

```
url=jdbc:h2:mem:e0b577d6-6828-4484-8b28-5440f50e6e93 user=SA
```

verilen şekilde yazıyoruz ve ‘Connect’ diyoruz. Böylece H2 Console ile veri tabanına bağlantı sağlıyoruz.

### *Docker ile veri tabanı oluşturma*

Postgres databese’si oluşturalım. Terminale yazdığımız,

```
docker run —name postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres
```

komutu ile ‘postgres’ adında ‘password’ şifresiyle oluşan postgres veri tabanı oluşuyor. (5432:5432) değeri ile de default code olarak tanımlanıyor.

## LOMBOK

```
@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {
```

Örneğin, ‘User’ sınıfına atadığımız JPA '@Data’ anatasyonu; sınıf içinde tanımlanan , 

```
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Integer id;
    @Column(name = "tc_kimlik",length=11)
    private String tcKimlik;
    @Column
    private String ad;
    @Column
    private String soyad;

    @Enumerated(EnumType.STRING)
    @Column
    private Gender gender;
    @Enumerated(EnumType.STRING)
    @Column(name = "urole")
    private Role role;
```

String , Integer, Gender ve Role ile atanan parametrelerin Getter-Setter-toString değerlerini Lombok aracılığıyla otomatik olarak arka kısımda oluşturur ve kod temizliğine yardımcı olur.

**Lomboku indiriyoruz ve kurulumunu kullanacağımız IDE’nin dosya konumuna yapıyoruz. Böylelikle Lombok kullanılır hale geliyor**



