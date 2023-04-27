<template>
  <div>
    <div class="form">
      <div class="form__item" v-for="(input, idx) in formInputs" :key="idx">
        <p>{{ INPUT_MESSAGES[input] }}</p>
        <div class="form__input">
          <input
            :type="input !== 'dates' ? 'text' : 'date'"
            :name="input"
            :placeholder="INPUT_MESSAGES[input]"
            v-model.trim="form[input]"
          />
          <button
            @click="addCollection(input)"
            :name="input"
            :disabled="!form[input]"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
    <div class="collections">
      <template v-for="(collection, key) in collections">
        <div :key="key" v-if="collection.length" class="collections__wrap">
          <p>{{ INPUT_MESSAGES[key] }}</p>
          <div
            class="collections__item"
            v-for="item in collection"
            :key="item.id"
          >
            <template v-if="key === 'events'">
              <div class="collections__item__text">
                <b>uid:</b> {{ item.id }} <b>название:</b>
                {{ getValueById("dates", item.dateId).value }}
                {{ getValueById("tasks", item.taskId).value }}
                {{ getValueById("statuses", item.statusId).value }}
              </div>
              <button
                @click="deleteCollection(key, item.id)"
                class="collections__item__button"
              >
                Удалить
              </button>
            </template>
            <template v-else>
              <div class="collections__item__text">
                <b>uid:</b> {{ item.id }} <b>название:</b> {{ item.value }}
              </div>
              <button
                @click="deleteCollection(key, item.id)"
                class="collections__item__button"
              >
                Удалить
              </button>
            </template>
          </div>
        </div>
      </template>
    </div>
    <table v-if="!isEmptyCollections" class="table">
      <thead>
        <tr>
          <th>Задачи / Даты</th>
          <th v-for="el in collections.dates" :key="el.id">
            {{ el.value }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in collections.tasks" :key="task.id">
          <td><input name="tableTask" type="text" v-model="task.value" /></td>

          <td v-for="date in collections.dates" :key="date.id">
            <button
              v-if="collections.statuses.length && !findEvent({ date, task })"
              @click="
                addEvent({
                  taskId: task.id,
                  dateId: date.id,
                  statusId: collections.statuses[0].id,
                })
              "
            >
              Добавить
            </button>
            <select
              v-if="findEvent({ date, task })"
              @change="changeEvent($event, { date, task })"
            >
              <option
                v-for="status in collections.statuses"
                :key="status.id"
                :value="status.id"
              >
                {{ status.value }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed, reactive } from "vue";
import { uid } from "uid";

export default {
  name: "BaseTable",

  setup() {
    const INPUT_MESSAGES = {
      tasks: "Задачи",
      dates: "Даты",
      statuses: "Статусы",
      events: "События",
    };

    const formInputs = ["tasks", "dates", "statuses"];

    const collections = reactive({
      tasks: [],
      dates: [],
      statuses: [],
      events: [],
    });

    const form = reactive({});
    const isEmptyCollections = computed(() => {
      return !collections.tasks.length && !collections.dates.length;
    });

    const addCollection = (key) => {
      collections[key].push({
        id: uid(4),
        value: form[key],
      });
      form[key] = null;
    };

    const addEvent = (obj) => {
      collections.events.push({
        id: uid(4),
        dateId: obj.dateId,
        taskId: obj.taskId,
        statusId: obj.statusId,
      });
    };

    const changeEvent = (val, obj) => {
      const event = findEvent(obj);
      event.statusId = val.target.value;
    };

    const getValueById = (collection, id) => {
      return collections[collection].find((el) => el.id === id) || "";
    };

    const deleteCollection = (key, id) => {
      if (key !== "events") {
        const event = collections.events.find(
          (el) => el.taskId === id || el.dateId === id || el.statusId
        );
        collections.events = collections.events.filter(
          (el) => el.id !== event.id
        );
      }
      collections[key] = collections[key].filter((el) => el.id !== id);
    };

    const findEvent = (obj) => {
      return collections.events.find(
        (el) => el.dateId === obj.date.id && el.taskId === obj.task.id
      );
    };

    return {
      INPUT_MESSAGES,
      addCollection,
      deleteCollection,
      collections,
      form,
      formInputs,
      addEvent,
      findEvent,
      changeEvent,
      getValueById,
      isEmptyCollections,
    };
  },
};
</script>
