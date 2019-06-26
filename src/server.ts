import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";

import { Car, cars as cars_list } from "./cars";

(async () => {
  let cars: Car[] = cars_list;

  //Create an express applicaiton
  const app = express();
  //default port to listen
  const port = 8082;

  //use middleware so post bodies
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json());

  // Root URI call
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the Cloud!");
  });

  // Get a greeting to a specific person
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get("/persons/:name", (req: Request, res: Response) => {
    let { name } = req.params;

    if (!name) {
      return res.status(400).send(`name is required`);
    }

    return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get("/persons/", (req: Request, res: Response) => {
    let { name } = req.query;

    if (!name) {
      return res.status(400).send(`name is required`);
    }

    return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as
  // an application/json body to {{host}}/persons
  app.post("/persons", async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send(`name is required`);
    }

    return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater

  app.get("/cars", async (req: Request, res: Response) => {
    res.status(200).send(JSON.stringify(cars));
  });

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found

  app.get("/cars/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(cars);
    const car = cars.find(x => x.id === +id);
    if (car) {
      res.status(200).send(JSON.stringify(car));
    } else {
      res.status(404).send(`Car with the id(${id}) not found.`);
    }
  });

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  app.post("/cars", async (req: Request, res: Response) => {
    let { id, make, type, model, cost } = req.body;
    if (id && type && model && cost) {
      id = +id;
      cost = +cost;
      cars.push({ make, type, model, cost, id });
      res
        .status(200)
        .send(
          `${JSON.stringify({ id, make, type, model })} added successfully!`
        );
    } else {
      res.status(400).send(`Invalid i/p params`);
    }
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
