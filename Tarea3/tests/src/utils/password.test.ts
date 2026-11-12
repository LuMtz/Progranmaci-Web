import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, comparePassword } from "./password.util";

describe ("Pruebas de contraseñas", () => {
    const password1 = "ClaveUno123!";
    const password2 = "ClaveDos123!";

    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });

    it("Genracion de hashes", () => {
        expect(hash1).toBeTruthy();
        expect(hash2).toBeTruthy();

        expect(hash1).not.toBe(password1);
        expect(hash2).not.toBe(password2);
    });

    it("Contraseña correcta", async () => {
        const isMatch1 = await comparePassword(password1, hash1);
        const isMatch2 = await comparePassword(password2, hash2);

        expect(isMatch1).toBe(true);
        expect(isMatch2).toBe(true);
    });

    it("Contraseña incorrecta", async () => {
        const isMatch1 = await comparePassword(password2,hash1);
        const isMatch2 = await comparePassword(password1,hash2);

        expect(isMatch1).toBe(false);
        expect(isMatch2).toBe(false);
    });
});