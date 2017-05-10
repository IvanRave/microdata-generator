Генератор микроразметки
===


Ошибки и ограничения валидаторов
---

Google:

- Нельзя использовать несколько элементов разметки ItemList на одной странице
- ItemList – недопустимый тип целевого объекта для свойства contactPoint
- contactType - HH (Значение hh должно содержать действительные контактные данные.) (replace to 'customer service' or smth else)

Яндекс:

- поле contactPoint содержит некорректный тип данных http://schema.org/ItemList. Допустимые типы данных http://schema.org/ContactPoint

- url required


Обязательные и опциональные свойства
---

Сущность описывается набором свойств. Например, сущность "Город" описывается:
- численность населения
- площадь

Если какой-то параметр неизвестен, устанавливается значение undefined|null

Важно различать **отсутствие значения параметра** и **отсутсвие самого параметра**.
Нам либо неизвестна численность населения, либо этот параметр вообще не учитывается в системе.

```
{
  popularity: undefined, // or null
  area: 100
}
```

В нормализованном виде все свойства сущности должны быть заполнены. Все опциональные свойства выносятся в отдельные сущности (one-to-one relationship). В реальных кейсах присутствуют опциональные свойства - для уменьшения сложности и увеличения производительности.


Отображение сущности
---

При отсутствии значений желательно корректно уведомлять пользователя.

```
<div>
  <span id="label">Popularity</span>
  <span id="value"></span>
</div>
```

Само сообщение об отсутсвии значения не содержится в модели. Его можно добавить с помощью представления, например, с помощью [CSS :empty selector](https://developer.mozilla.org/ru/docs/Web/CSS/:empty):

```
#value:empty:after {
  content: 'no value';
}
```

Использование специфичных тэгов
---

Если тип значения - "Ссылка", то при отсутствии значения невалидно будет указывать пустую ссылку:

```<a id="value" href=""></a>```

Один из вариантов: заменить тэг на тэг по умолчанию (a --> span). При этом надо скопировать все аттрибуты из прежнего тэга.

Валидатор микроразметки требует наличия href для значений-ссылок. Как хак, можно скрыть сам факт наличия свойства (удалить itemprop атрибут).


Документо-ориентированная модель
---

Один "Сервис" может иметь несколько "Предложений" (один ко многим)
Одно "Предложение" содержит ссылку на один "Сервис" (один к одному)
Одно "Предложение" содержит ссылку на одного "Продавца" (один к одному)
Один "Продавец" может иметь несколько "Предложений" (один ко многим)

Сущность "Предложение" является ассоциативной между "Сервисом" и "Продавцом"

На разных страницах эта модель может быть представлена с разной корневой сущностью:
- Продавец -> список предложений ( + сервисов)
- Сервис -> список предложений ( + продавцов)
- Предложение -> сервис и продавец


Перечень объектов
---

> Use markup for a specific product, not a category or list of products. For example, “shoes in our shop” is not a specific product. See also our [structured data policies](https://developers.google.com/search/docs/guides/intro-structured-data#multiple-entities-on-the-same-page) for multiple entities on the same page.

https://developers.google.com/search/docs/data-types/products

> A category page listing several different products (or recipes, videos, or any other type). Each entity should be marked up using the relevant schema.org type, such as schema.org/Product for product category pages. Marking up just one category entity from all listed on the page is against our guidelines.

https://blog.heppresearch.com/2015/07/09/google-product-rich-snippets-for-multiple-products-on-a-page/

> the main entity is a http://schema.org/SearchResultsPage type, linked to the seven offers via http://schema.org/offers. This is wrong, because the offers property for a http://schema.org/SearchResultsPage type is inherited from http://schema.org/CreativeWork and links to offers of the creative work.


Идентификатор сущности
---

Должны ли ДОМ-элементы содержать идентификаторы?

- itemtype + itemprop: доступ к конкретному свойству сущности заданного типа, например к свойству "заголовок" всех сущностей типа "рекламный блок" на странице
- если необходим доступ к конкретному "рекламному блоку", можно прописать всю иерархию от корневой сущности
- если необходим доступ к конкретному элементу из списка сущностей, можно использовать порядковый номер в списке. Если массив неупорядоченный
