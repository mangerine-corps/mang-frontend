import {
  Box,
  Button,
  Drawer,
  HStack,
  Input,
  InputGroup,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaTimes } from "react-icons/fa";
import { HiMiniPlus } from "react-icons/hi2";
import moment from "moment";
import * as Yup from "yup";
import { isEmpty, isEqual, map } from "es-toolkit/compat";

import {
  useAddSkillMutation,
  useDeleteSkillMutation,
} from "mangarine/state/services/profile.service";
import { useProfile } from "mangarine/state/hooks/profile.hook";
import CustomInput from "../customcomponents/Input";
import { toaster } from "../ui/toaster";

// ------------------ Validation Schema ------------------ //
const skillsSchema = Yup.object().shape({
  name: Yup.string().required("Skill name is required"),
  skills: Yup.array()
    .of(Yup.string())
    .min(1, "At least 1 skill is required")
    .required("Skills are required"),
});

interface SkillObj {
  id: string;
  name: string;
  skills: string[];
}

// ------------------ Input With Pills ------------------ //
const InputWithPills = ({
  value,
  onChange,
  setSkills,
}: {
  value: string[];
  onChange: (skills: string[]) => void;
  setSkills: (skills: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim()) {
      const newSkills = [...value, inputValue.trim()];
      onChange(newSkills);
      setSkills(newSkills);
      setInputValue("");
    }
  };

  return (
    <VStack align="flex-start" w="full">
      <Text fontSize="0.75rem" color="text_primary" fontWeight="400">
        Skills
      </Text>
      <InputGroup>
        <Input
          px={4}
          placeholder="Enter skill and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          color={"text_primary"}
          _placeholder={{
            color: "gray.150",
            fontSize: "14px",
          }}
        />
      </InputGroup>
    </VStack>
  );
};

// ------------------ Single Skill Item ------------------ //
const SkillItem = ({
  skill,
  onClose,
}: {
  skill: SkillObj;
  onClose: () => void;
}) => {
  const [skills, setSkills] = useState<string[]>(skill.skills);
  const [isDisabled, setIsDisabled] = useState(true);
  const [addNewSkill, { isLoading }] = useAddSkillMutation();
  const [deleteSkill, { isLoading: deleteLoading }] = useDeleteSkillMutation();
  const { skills: profileSkills } = useProfile();

  const { control, getValues, formState } = useForm({
    resolver: yupResolver(skillsSchema),
    defaultValues: { name: skill.name, skills: skill.skills },
  });

  // Enable Save button only if something changed
  useEffect(() => {
    setIsDisabled(
      skill.name === getValues("name") && isEqual(skill.skills, skills)
    );
  }, [skills, skill, getValues]);

  const handleSave = () => {
    const values = getValues();
    addNewSkill(values)
      .unwrap()
      .then((payload) => {
        toaster.create({
          title: "Success!",
          description: payload.message,
          type: "success",
          duration: 9000,
          closable: true,
        });
        onClose();
      })
      .catch(console.error);
  };

  const handleDelete = (item) => {
    console.log(item, "delee");
    const id = item.id;
    deleteSkill(id)
      .unwrap()
      .then((res) => {
        console.log(res, "res");
        toaster.create({
          title: "Success!",
          description: res.message,
          type: "success",
          duration: 9000,
          closable: true,
        });
          setSkills((prev) => prev.filter((skill)=> skill !==item.name));
        onClose();
      })
      .catch((err) => {
        console.log(err);
        toaster.create({
          title: "Error!",
          description: err?.message || "Failed to delete skill",
          type: "error",
          duration: 9000,
          closable: true,
        });
        onClose();
      });

  };

  const handleRemovePill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <VStack w="full" p={5} borderWidth={1} rounded="15px" shadow="sm">
      {/* Skill Name */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <CustomInput
            {...field}
            id={`skill_${skill.id}`}
            label="Skill Name"
            placeholder="Enter Skill Name"
            required
          />
        )}
      />

      {/* Skills Pills Input */}
      <Controller
        name="skills"
        control={control}
        render={({ field }) => (
          <InputWithPills
            value={field.value}
            onChange={field.onChange}
            setSkills={setSkills}
          />
        )}
      />

      {/* Pills */}
      <HStack wrap="wrap" w="full" bg="primary.150" p={2} rounded="lg">
        {skills.map((s, idx) => (
          <Tag.Root
            borderColor={"text_primary"} borderWidth={0.5} key={idx} p={2} rounded="full">
            <Tag.Label>{s}</Tag.Label>
            <Tag.CloseTrigger onClick={() => handleRemovePill(idx)} />
          </Tag.Root>
        ))}
      </HStack>

      {/* Save Button */}
      <HStack w="full" justify="flex-end">
        <Button
          w="45%"
          rounded="6px"
          bg="primary.300"
          color="white"
          // disabled={isDisabled || !formState.isValid}
          loading={deleteLoading}
          onClick={() => {
            handleDelete(skill);
          }}
        >
          Delete Skill
        </Button>
        <Button
          w="45%"
          rounded="6px"
          bg="primary.300"
          color="white"
          // disabled={isDisabled || !formState.isValid}
          loading={isLoading}
          onClick={handleSave}
        >
          Save Skill
        </Button>
      </HStack>
    </VStack>
  );
};

// ------------------ Skills Modal ------------------ //
const SkillsModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) => {
  const { skills } = useProfile();
  const [localSkills, setLocalSkills] = useState<SkillObj[]>(skills);

  useEffect(() =>
    setLocalSkills(skills), [skills]);

  const handleAddSkillBlock = () => {
    const newSkill: SkillObj = {
      id: moment().unix().toString(),
      name: "",
      skills: [],
    };
    setLocalSkills((prev) => [...prev, newSkill]);
  };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} size="md">
      <Drawer.Backdrop />
      <Drawer.Positioner zIndex={"max"}>
        <Drawer.Content pt="6" px="3">
          <Drawer.Header>
            <HStack justify="space-between" w="full" px="6" py={4}>
              <Text fontSize="2.5rem" fontWeight="700" color="text_primary">
                Skills
              </Text>
              <Box
                as="button"
                border={0.5}
                rounded={4}
                p={2}
                borderColor="gray.150"
                shadow="md"
                onClick={onOpenChange}
              >
                <FaTimes />
              </Box>
            </HStack>
          </Drawer.Header>

          <Drawer.Body px="2" py="8" bg="bg_box">
            <VStack w="full" spaceY={4}>
              {map(localSkills, (skill) => (
                <SkillItem
                  key={skill.id}
                  skill={skill}
                  onClose={onOpenChange}
                />
              ))}
            </VStack>

            {/* Add More Skills */}
            <HStack mt={6} onClick={handleAddSkillBlock} cursor="pointer">
              <Box
                border={0.5}
                rounded={4}
                py={2}
                px={2}
                borderColor="gray.150"
                shadow="md"
                color={"text_primary"}
              >
                <HiMiniPlus />
              </Box>
              <Text fontSize="0.875rem" fontWeight="600" color="gray.500">
                Add Skills
              </Text>
            </HStack>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default SkillsModal;
